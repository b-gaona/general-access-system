import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import SortableTable from "../components/SortableTable";
import moment from "moment";
import "moment/locale/es";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Paginator from "../components/Paginator";
import useUsersContext from "../hooks/use-users-context";
import Skeleton from "../components/Skeleton";
import SearchBar from "../components/SearchBar";
import DownloadButton from "../components/DownloadButton";
import BasicDateRangePicker from "../components/DatePicker";
import useConfigurationContext from "../hooks/use-configuration-context";

function TablePage() {
  const { BASE_URL } = useConfigurationContext();
  const [data, setData] = useState([]);
  const { page, setIsLoading, isLoading, filteredUsers, term, date } =
    useUsersContext();

  function fetchData() {
    setIsLoading(true);
    //Get all the data
    axios.get(`${BASE_URL}/v1/status?page=${page}&limit=15`).then((res) => {
      setTimeout(() => {
        setIsLoading(false);
        setData(res.data);
      }, 150);
    });
  }

  // eslint-disable-next-line
  const stableFetch = useCallback(fetchData, [page]);

  useEffect(() => {
    stableFetch();
  }, [stableFetch]);

  useEffect(() => {
    //Listen for future events
    const eventSource = new EventSource(`${BASE_URL}/v1/events`);

    function updateMessage(message) {
      //If someone sends many objects in a row
      if (message.length > 1) {
        for (const iterator of message) {
          setData((current) => {
            return [...current, iterator];
          });
        }
      } else {
        setData((current) => {
          return [...current, message];
        });
      }
    }

    eventSource.onmessage = function (event) {
      const eventData = JSON.parse(event.data);
      //If we want to insert a new data
      if (eventData.type === "insert") {
        updateMessage(eventData.data);
      }
    };

    eventSource.onerror = function () {
      updateMessage({ error: "Server closed connection" });
      eventSource.close();
    };
  }, []);

  const config = [
    {
      label: "Matricula",
      render: (data) => data.user.plate,
      sortValue: (data) => data.user.plate,
    },
    {
      label: "Nombre completo",
      render: (data) => data.user.name,
      sortValue: (data) => data.user.name,
    },
    {
      label: "Localización",
      render: (data) => data.location,
      sortValue: (data) => data.location,
    },
    {
      label: "Fecha",
      render: (data) => moment(data.date).local("es").format("LLL"),
      sortValue: (data) => data.date,
    },
    {
      label: "Status",
      render: (data) =>
        data.status ? (
          <h1 className="bg-green-600 w-full py-1 text-center text-white border-green-800 border-2 px-2">
            Entrada
          </h1>
        ) : (
          <h1 className="bg-red-600 w-full py-1 text-center text-white border-red-800 border-2 px-2">
            Salida
          </h1>
        ),
      sortValue: (data) => data.status,
    },
  ];

  const keyFn = (uniqueData) => {
    return uniqueData._id;
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <h1 className="text-3xl uppercase text-center font-semibold mb-4">
        Tabla de las entradas de usuarios
      </h1>
      <div className="mx-16 flex items-center flex-col">
        <div className="flex gap-7 justify-center items-start w-full p-2">
          <BasicDateRangePicker />
          <SearchBar collection="status" />
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <SortableTable
            data={term !== "" || date !== "" ? filteredUsers : data}
            config={config}
            keyFn={keyFn}
            loader={
              isLoading && <Skeleton times={10} className="h-12 w-full" />
            }
          />
          <Paginator />
        </div>
        <div className="flex justify-end w-full">
          <DownloadButton></DownloadButton>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TablePage;
