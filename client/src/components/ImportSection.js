import { useRef, useState } from "react";
import useMessagesContext from "../hooks/use-messages-context";
import useUsersContext from "../hooks/use-users-context";
import Spinner from "./Spinner";
import Button from "./Button";
import { SiMicrosoftexcel } from "react-icons/si";

function ImportSection() {
  const { IMPORT_MESSAGE } = useMessagesContext();
  const { createUsersByCSV, deleteUsersByCSV } = useUsersContext();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileUpload = (evt) => {
    const previousSelected = selectedFile;

    const formData = new FormData();
    formData.append("file", evt.target.files[0]);
    // eslint-disable-next-line
    const [first, second] = [...formData][0];

    if (second !== "undefined") {
      setSelectedFile(evt.target.files[0]);
      setFileName(`Archivo seleccionado: ${second.name}`);
    } else {
      setSelectedFile(previousSelected);
    }
  };

  const handleImport = async (evt) => {
    evt.preventDefault();

    try {
      setImportLoading(true);
      const res = await createUsersByCSV(selectedFile);
      if (res === "complete") {
        setMessage(IMPORT_MESSAGE.SUCCESS);
      } else if (res === "empty") {
        setMessage(IMPORT_MESSAGE.NO_CHANGES);
      } else if (res === "error") {
        setMessage(IMPORT_MESSAGE.ERROR);
      } else if (res === "incomplete") {
        setMessage(IMPORT_MESSAGE.INCOMPLETE);
      }
    } catch (error) {
      setMessage(IMPORT_MESSAGE.ERROR);
    } finally {
      setImportLoading(false);
      setFileName("");
      setSelectedFile(null);
      setTimeout(() => {
        setMessage(null);
      }, 12000);
    }
  };

  const handleDelete = async (evt) => {
    evt.preventDefault();
    try {
      setRemoveLoading(true);
      const res = await deleteUsersByCSV(selectedFile);
      if (res === "complete") {
        setMessage(IMPORT_MESSAGE.SUCCESS);
      } else if (res === "empty") {
        setMessage(IMPORT_MESSAGE.NO_CHANGES);
      } else if (res === "error") {
        setMessage(IMPORT_MESSAGE.ERROR);
      } else if (res === "incomplete") {
        setMessage(IMPORT_MESSAGE.INCOMPLETE);
      }
    } catch (error) {
      setMessage(IMPORT_MESSAGE.ERROR);
    } finally {
      setRemoveLoading(false);
      setFileName("");
      setSelectedFile(null);
      setTimeout(() => {
        setMessage(null);
      }, 12000);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full flex flex-col justify-center mt-3 mx-5">
      {message}
      {importLoading && (
        <div className="pt-4 flex flex-col items-center">
          <Spinner type="cloud" />
          <p>Importando datos...</p>
        </div>
      )}
      {removeLoading && (
        <div className="pt-4 flex flex-col items-center">
          <Spinner type="cloud" />
          <p>Removiendo datos...</p>
        </div>
      )}
      <form>
        <div className="flex gap-10 justify-between items-start">
          <Button success type="button" onClick={handleButtonClick}>
            Cargar archivo CSV
            <SiMicrosoftexcel />
          </Button>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <Button primary type="submit" onClick={handleImport}>
                Importar lista de alumnos
              </Button>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <Button danger type="submit" onClick={handleDelete}>
                Borrar lista de alumnos
              </Button>
            </div>
            <p className="col-span-2 text-center">{fileName}</p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ImportSection;
