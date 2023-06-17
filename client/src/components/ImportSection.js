import { useRef, useState } from "react";
import useMessagesContext from "../hooks/use-messages-context";
import useUsersContext from "../hooks/use-users-context";
import Spinner from "./Spinner";
import Button from "./Button";
import { SiMicrosoftexcel } from "react-icons/si";

function ImportSection() {
  const { IMPORT_MESSAGE } = useMessagesContext();
  const { createUsersByCSV } = useUsersContext();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileUpload = (event) => {
    const previousSelected = selectedFile;

    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    // eslint-disable-next-line
    const [first, second] = [...formData][0];

    if (second !== "undefined") {
      setSelectedFile(event.target.files[0]);
      setFileName(`Archivo seleccionado: ${second.name}`);
    } else {
      setSelectedFile(previousSelected);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setImportLoading(true);
      const res = await createUsersByCSV(selectedFile);
      if (res === "Add") {
        setMessage(IMPORT_MESSAGE.SUCCESS);
      } else if (res === "Same") {
        setMessage(IMPORT_MESSAGE.NO_CHANGES);
      } else if (res === "Error") {
        setMessage(IMPORT_MESSAGE.ERROR);
      }
    } catch (error) {
      setMessage(IMPORT_MESSAGE.ERROR);
    } finally {
      setImportLoading(false);
      setFileName("");
      setSelectedFile(null);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
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
      <form className="flex flex-col items-center">
        <div className="flex gap-10">
          <Button success type="button" onClick={handleButtonClick}>
            Selecciona archivo CSV
            <SiMicrosoftexcel />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <Button primary type="submit" onClick={handleSubmit}>
            Importar CSV
          </Button>
        </div>
        <p>{fileName}</p>
      </form>
    </div>
  );
}

export default ImportSection;
