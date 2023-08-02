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
import axios from "axios";

function RowInfo({ config, user }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const [editUser, setEditUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    config: newConfig,
    TEACHER_LABEL,
    STUDENT_LABEL,
    ADMIN_LABEL,
  } = useConfigurationContext();

  const { deleteUserById, editUserById } = useUsersContext();

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
    try {
      const res = await axios.get(
        `http://localhost:8000/v1/users/get/plate/${user.plate}`
      );
      console.log(res.data);
      return true;
    } catch (error) {
      return false;
    }
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

  const modalCard = (
    <Modal onClose={handleClose}>
      {deleteUser && USER_MESSAGE.DELETE}
      {showDeleteModal && errorMessage}
      <div className="flex justify-center">
        <img
          src="https://www.pngrepo.com/png/128239/512/id-card.png"
          alt="id_photo"
          width="200px"
        />
      </div>
      <p className="text-center">
        ¿Deseas registrar al usuario '{user.name}' con número de identificación
        '{user.plate}' a la credencial?
      </p>
      <div className="flex justify-around pt-4">
        <Button onClick={handleClose} danger>
          Cancelar
        </Button>
        <Button onClick={handleRegisterCard} primary>
          Si, quiero registrarla
        </Button>
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