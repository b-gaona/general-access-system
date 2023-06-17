import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import SearchItem from "./SearchItem";
import useUsersContext from "../hooks/use-users-context";

function SearchBar() {
  const { page, setPage, searchTerm, setSearchTerm, term, setTerm } =
    useUsersContext();
  const [show, setShow] = useState(false);

  const handleSearchTermChange = ({ text }) => {
    setSearchTerm(text);
  };

  const handleClick = (evt) => {
    evt.preventDefault();
    setTerm(searchTerm);
    setSearchTerm("");
    setPage(1);
    setShow(true);
  };

  const onClose = () => {
    setShow(false);
    setTerm("");
  };

  const renderedSearchItems = (
    <SearchItem searchTerm={term} page={page} onClose={onClose} />
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
