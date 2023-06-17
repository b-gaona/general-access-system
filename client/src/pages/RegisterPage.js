import { useState } from "react";

import Form from "../components/Form";
import Panel from "../components/Panel";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";

import useConfigurationContext from "../hooks/use-configuration-context";
import useMessagesContext from "../hooks/use-messages-context";
import useUsersContext from "../hooks/use-users-context";

function RegisterPage() {
  //Showing elements on screen
  const [showModal, setShowModal] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { objectConfig, config, TEACHER_LABEL, STUDENT_LABEL, ADMIN_LABEL } =
    useConfigurationContext();

  const { createUser } = useUsersContext();

  const { ERROR_MESSAGE, USER_MESSAGE } = useMessagesContext();

  //Info returned in the form
  const [user, setUser] = useState(objectConfig);

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

    //If some property has an empty value
    if (Object.values(newUser).some((element) => !element)) {
      setErrorMessage(ERROR_MESSAGE);
    } else {
      setErrorMessage(false);
      setShowModal(true);
    }
    setUser(info);
  };

  const handleClose = () => {
    if (addUser) {
      setUser(objectConfig);
    }
    setShowModal(false);
    setAddUser(false);
  };

  const handleAdd = async () => {
    setIsLoading(true);
    // Send user to the database
    if (await createUser(user)) {
      setErrorMessage(false);
      setAddUser(true);
    } else {
      setErrorMessage(ERROR_MESSAGE);
    }
    setIsLoading(false);
  };

  const confirmData = (
    <div className="flex justify-around gap-5 items-center">
      <h3>¿Estás seguro que los datos son correctos? </h3>
      <Button
        className="px-8 rounded-sm mx-auto"
        onClick={async () => {
          await handleAdd();
        }}
        primary
      >
        Si, estoy seguro
      </Button>
    </div>
  );

  const actionBar = (
    <div>
      {addUser || confirmData}
      <div className="mt-5 mb-2" style={{ fontSize: "10px" }}>
        <p>
          Al confirmar los datos estás consciente de que no podrás cambiar los
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
    </div>
  );

  // eslint-disable-next-line
  const modalInfo = config.map((info) => {
    const {
      input: { property },
    } = info;

    if (user[property]) {
      return (
        <div key={property}>
          <h2 className="text-lg font-semibold">{info.label}</h2>
          <p>{user[property + "_label"] || user[property]}</p>
        </div>
      );
    }
  });

  const modal = (
    <Modal onClose={handleClose} actionBar={actionBar}>
      {isLoading && <Spinner type="loading" />}
      {addUser && USER_MESSAGE.ADD}
      {showModal && errorMessage}
      <div className="grid grid-cols-2 gap-3 items-center">{modalInfo}</div>
    </Modal>
  );

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <div className="flex bg-white w-100 h-full justify-center items-center mt-10">
        <Panel className="bg-gray-50 px-6 w-1/3 rounded-xl">
          <div>{!showModal && errorMessage}</div>
          <Form
            onSubmit={handleSubmit}
            config={config}
            objectConfig={user}
            buttonInfo="Dar usuario de alta"
          >
            <h1 className="text-3xl text-center uppercase font-semibold">
              Alta de usuarios
            </h1>
          </Form>
        </Panel>
        {showModal && modal}
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;
