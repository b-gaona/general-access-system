import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import SearchItem from "./SearchItem";
import useUsersContext from "../hooks/use-users-context";
import axios from "axios";
import useConfigurationContext from "../hooks/use-configuration-context";

function SearchBar({ collection }) {
  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    term,
    setTerm,
    dateRange,
    setFilteredUsers,
    filteredUsers,
    setIsLoading,
    setDate,
  } = useUsersContext();
  const {BASE_URL} = useConfigurationContext();

  const [show, setShow] = useState(false);

  const handleSearchTermChange = ({ text }) => {
    setSearchTerm(text);
  };

  const handleClick = async (evt) => {
    evt.preventDefault();
    setTerm(searchTerm);
    setSearchTerm("");
    setPage(1);

    if (searchTerm) {
      setShow(true);
    } else {
      //Doesn't have a searchTerm, so don't show and filter when it's necessary between dates
      onClose();

      const [initialDate, endDate] = dateRange;
      const object = {};

      if (initialDate || endDate) {
        if (initialDate && endDate) {
          object.minDate = initialDate;
          object.maxDate = endDate;
        } else if (initialDate && !endDate) {
          object.minDate = initialDate;
        } else if (endDate && !initialDate) {
          object.maxDate = endDate;
        }
        setDate("date");
      } else {
        setDate("");
      }

      try {
        const before = filteredUsers;
        setFilteredUsers([]);
        setIsLoading(true);
        const res = await axios.post(
          `${BASE_URL}/v1/${collection}/get/dates?page=${page}&limit=15`,
          object
        );

        setTimeout(() => {
          if (res.data) {
            setFilteredUsers(res.data);
          } else {
            setFilteredUsers(before);
          }
          setIsLoading(false);
        }, 150);
      } catch (error) {
        console.log(error);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onClose = async () => {
    setShow(false);
    setTerm("");

    const [initialDate, endDate] = dateRange;
    const object = {};

    if (initialDate || endDate) {
      if (initialDate && endDate) {
        object.minDate = initialDate;
        object.maxDate = endDate;
      } else if (initialDate && !endDate) {
        object.minDate = initialDate;
      } else if (endDate && !initialDate) {
        object.maxDate = endDate;
      }
      setDate("date");
    } else {
      setDate("");
    }

    try {
      const before = filteredUsers;
      setFilteredUsers([]);
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/v1/${collection}/get/dates?page=${page}&limit=15`,
        object
      );

      setTimeout(() => {
        if (res.data) {
          setFilteredUsers(res.data);
        } else {
          setFilteredUsers(before);
        }
        setIsLoading(false);
      }, 150);
    } catch (error) {
      console.log(error);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderedSearchItems = (
    <SearchItem
      searchTerm={term}
      collection={collection}
      page={page}
      onClose={onClose}
    />
  );

  return (
    <div>
      <div className="flex items-center">
        <form className="flex items-center justify-center w-full pb-5 gap-8">
          <div className="flex items-center">
            <label className="mb-0 mr-3">Buscar: </label>
            <Input
              className="w-96 border border-gray-400 indent-2 p-1 rounded-l-lg"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Busca por una palabra clave. Ejemplo: Tecnologías"
            />
            <Button
              onClick={handleClick}
              className="py-1 border border-gray-400 rounded-r-lg"
              secondary
            >
              Filtrar
            </Button>
          </div>
          {show && (
            <div className="flex gap-3 flex-wrap">{renderedSearchItems}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SearchBar;
