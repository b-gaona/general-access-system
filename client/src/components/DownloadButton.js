import React from "react";
import axios from "axios";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import useUsersContext from "../hooks/use-users-context";
import Button from "./Button";
import { SiMicrosoftexcel } from "react-icons/si";
import moment from "moment";
import "moment/locale/es";

const DownloadButton = () => {
  const { term } = useUsersContext();
  const handleDownload = async (evt) => {
    evt.preventDefault(); // Prevent the default button click behavior

    try {
      const keyword = term === "" ? "" : `?keyword=${term}`;
      console.log(keyword);
      const response = await axios.get(
        `http://localhost:8000/v1/status/export${keyword}`
      );
      const dataArray = response.data; // Assuming the response is an array
        console.log(dataArray);
      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        console.error("Invalid data format or empty array.");
        return;
      }

      // Convert the array to a worksheet
      const worksheet = utils.json_to_sheet(dataArray);

      // Create a workbook and add the worksheet
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Generate the Excel file
      const excelData = write(workbook, { bookType: "xlsx", type: "array" });

      // Create a Blob from the Excel data
      const blob = new Blob([excelData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Save the file using FileSaver.js
      saveAs(
        blob,
        `Datos de ${moment(Date.now()).local("es").format("LLL")}.xlsx`
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Button success type="button" onClick={handleDownload}>
      Exportar a Excel
      <SiMicrosoftexcel />
    </Button>
  );
};

export default DownloadButton;
