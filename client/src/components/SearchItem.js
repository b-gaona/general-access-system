import axios from "axios";
import Button from "./Button";
import { useCallback, useEffect, useState } from "react";
import useUsersContext from "../hooks/use-users-context";

function SearchItem({ searchTerm, onClose, page }) {
  const { filteredUsers, setFilteredUsers, setIsLoading, setPage } = useUsersContext();
  const [error, setError] = useState(false);

  const fetchFilteredUsers = async () => {
    try {
      const before = filteredUsers;
      setFilteredUsers([]);
      setError(false);
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:8000/v1/users/get/${searchTerm}?page=${page}&limit=15`
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
      setFilteredUsers([]);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line
  const stableFetchFilteredUsers = useCallback(fetchFilteredUsers, [page, searchTerm]);

  useEffect(() => {
    stableFetchFilteredUsers();
  }, [stableFetchFilteredUsers, page]);

  const handleClose = () => {
    setFilteredUsers([]);
    setPage(1);
    onClose();
  };

  return (
    <div
      className={`flex justify-between items-center flex-row-reverse w-full bg-gray-100 p-1 border border-gray-400 rounded-sm ${
        error && "bg-red-200 border-red-400"
      }`}
    >
      <div>
        <Button
          className="font-semibold text-gray-500 hover:text-gray-700 border-0 ease-in-out duration-300 text-md p-0"
          onClick={handleClose}
        >
          X
        </Button>
      </div>
      <p className="pl-3">{searchTerm}</p>
    </div>
  );
}

export default SearchItem;
