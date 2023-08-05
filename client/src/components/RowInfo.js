import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { AiFillIdcard } from "react-icons/ai";
import { useState } from "react";

import Button from "./Button";
import Modal from "./Modal";
import Form from "./Form";
import Spinner from "./Spinner";

import useConfigurationContext from "../hooks/use-configuration-context";
import useMessagesContext from "../hooks/use-messages-context";

import { useEffect } from "react";
import useUsersContext from "../hooks/use-users-context";

function RowInfo({ config, user }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const [editUser, setEditUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [cardAssigned, setCardAssigned] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    config: newConfig,
    TEACHER_LABEL,
    STUDENT_LABEL,
    ADMIN_LABEL,
    BASE_URL
  } = useConfigurationContext();

  const { deleteUserById, editUserById, addCredential } = useUsersContext();

  const { USER_MESSAGE, ERROR_MESSAGE } = useMessagesContext();

  //Info returned in the form
  const [newUser, setNewUser] = useState(user);

  const handleSubmit = (info) => {
    let newUser = { ...info };

    //The ending with '_label' is reserved to the select inputs. It refers to the label of the selected option. It's assigned in the Form component. If you want to use the value of the select option just use the property name.

    //Removing all unnecessary properties
    if (info.role_label === TEACHER_LABEL) {
      const { area, department, ...rest } = info;
      newUser = { ...rest };
    }
    if (info.role_label === STUDENT_LABEL) {
      const { department, ...rest } = info;
      newUser = { ...rest };
    }
    if (info.role_label === ADMIN_LABEL) {
      const { career, area, ...rest } = info;
      newUser = { ...rest };
    }

    setNewUser(info);
    //If some property has an empty value
    if (Object.values(newUser).some((element) => !element)) {
      setErrorMessage(ERROR_MESSAGE);
    } else {
      setErrorMessage(false);
      setShowEditModal(true);

      const copyWithId = { ...user, ...newUser };
      handleEdit(copyWithId);
    }
  };

  const handleClose = () => {
    if (editUser) {
      setNewUser(user);
    }
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowCardModal(false);
    setEditUser(false);
    setDeleteUser(false);
    setCardAssigned(false);
  };

  const handleEdit = async (user) => {
    setIsLoading(true);
    const editableUser = await editUserById(user._id, user);
    if (editableUser) {
      setErrorMessage(false);
      setEditUser(true);
      setNewUser(editableUser);
    } else {
      setErrorMessage(ERROR_MESSAGE);
    }
    setIsLoading(false);
  };

  const handleDelete = async (user) => {
    setIsLoading(true);
    if (await deleteUserById(user._id)) {
      setErrorMessage(false);
      setDeleteUser(true);
    } else {
      setErrorMessage(ERROR_MESSAGE);
    }
    setIsLoading(false);
  };

  const handleRegisterCard = async () => {
    setIsLoading(true);
    setCardAssigned(false);
    setErrorMessage(false);
    //Listen for future events
    const eventSource = new EventSource(
      `${BASE_URL}/v1/events/credential`
    );

    eventSource.onmessage = async function (event) {
      const eventData = JSON.parse(event.data);
      //If we want to upsert a new data
      if (eventData.type === "insert" || eventData.type === "update") {
        const credentialObj = eventData.data;
        try {
          setIsLoading(false);
          const res = await addCredential(credentialObj._id, user._id);
          if (res) {
            setCardAssigned(true);
          } else {
            setErrorMessage(ERROR_MESSAGE);
          }
          eventSource.close();
        } catch (error) {
          setIsLoading(false);
          setErrorMessage(ERROR_MESSAGE);
          eventSource.close();
        }
      }
    };

    eventSource.onerror = function () {
      eventSource.close();
    };
  };

  useEffect(() => {
    let userSel = {};
    newConfig.forEach((info) => {
      const {
        input: { property },
      } = info;

      if (user[property]) {
        userSel = {
          ...userSel,
          [property]: user[property]._id || user[property],
          [property + "_label"]: user[property][property] || user[property],
        };
      }
    });
    setNewUser(userSel);
    // eslint-disable-next-line
  }, [editUser]);

  const modalEditInfo = (
    <Form
      onSubmit={handleSubmit}
      config={newConfig}
      objectConfig={newUser}
      buttonInfo="Actualizar información"
    />
  );

  const modalEdit = (
    <Modal onClose={handleClose}>
      {isLoading && <Spinner type="loading" />}
      {editUser && USER_MESSAGE.EDIT}
      {showEditModal && errorMessage}
      <div className="flex justify-center items-center">{modalEditInfo}</div>
    </Modal>
  );

  const modalDelete = (
    <Modal onClose={handleClose}>
      {deleteUser && USER_MESSAGE.DELETE}
      {showDeleteModal && errorMessage}
      <p className="text-center">
        ¿Estás seguro que deseas eliminar a este usuario permanentemente?
      </p>
      <div className="flex justify-around pt-4">
        <Button onClick={handleClose} danger>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            handleDelete(user);
          }}
          primary
        >
          Si, estoy seguro
        </Button>
      </div>
      <div className="mt-5" style={{ fontSize: "10px" }}>
        <p>
          Al aceptar esta acción estás consciente de que no podrás cambiar los
          datos en un futuro. En caso de haber un problema, contactános al
          correo:{" "}
          <a
            className="cursor-pointer underline"
            href="mailto:direccionti@uttn.mx"
          >
            direccionti@uttn.mx
          </a>
        </p>
      </div>
    </Modal>
  );

  const showCurrentCredential = user.card_id ? (
    <div className="text-md text-center font-semibold">
      <p>Ya cuenta con una credencial este usuario.</p>
    </div>
  ) : (
    false
  );

  const modalCard = (
    <Modal onClose={handleClose}>
      {isLoading && (
        <div>
          <p className="text-md font-semibold text-center">
            Por favor escanea la credencial...
          </p>
          <Spinner type="loading" />
        </div>
      )}
      {cardAssigned && USER_MESSAGE.CARD}
      {showCardModal && errorMessage}
      {!isLoading && !cardAssigned && showCurrentCredential}
      <div className="flex justify-center">
        <img
          src="https://www.pngrepo.com/png/128239/512/id-card.png"
          alt="id_photo"
          width="200px"
        />
      </div>
      <p className="text-center">
        ¿Deseas asignar al usuario '{user.name}' con número de identificación '
        {user.plate}' a la credencial?
      </p>
      <div className="flex justify-around pt-4">
        <Button onClick={handleClose} danger>
          Cancelar
        </Button>
        <Button onClick={handleRegisterCard} primary>
          Si, quiero asignar la credencial
        </Button>
      </div>
      <div className="m-5">
        <p className="text-xs">
          NOTA: Asegúrese de tener el módulo de registro conectado vía Ethernet
          y USB a su PC. De caso contrario, esta operación no se podrá realizar.
        </p>
      </div>
    </Modal>
  );

  const handleEditClick = async () => {
    setShowEditModal(true);
  };

  const handleDeleteClick = async () => {
    setShowDeleteModal(true);
  };

  const handleCardClick = async () => {
    setShowCardModal(true);
  };

  // eslint-disable-next-line
  const renderedInfo = config.map((element) => {
    if (element.label !== "Fecha" && element.render(user) !== "N/A") {
      return (
        <div key={element.label}>
          <h2 className="font-semibold text-lg">{element.label}</h2>
          <p>{element.render(user)}</p>
        </div>
      );
    }
  });

  return (
    <tr>
      <td className="border-b p-5" colSpan={12}>
        <div className="flex  justify-between w-full gap-x-10">
          {renderedInfo}{" "}
          <div className="flex gap-3">
            <Button onClick={async () => await handleCardClick()} secondary>
              <AiFillIdcard />
            </Button>
            <Button onClick={async () => await handleEditClick()} primary>
              <FiEdit />
            </Button>
            <Button onClick={async () => await handleDeleteClick()} danger>
              <MdDelete />
            </Button>
          </div>
          {showEditModal && modalEdit}
          {showDeleteModal && modalDelete}
          {showCardModal && modalCard}
        </div>
      </td>
    </tr>
  );
}

export default RowInfo;
