import { createContext, useCallback, useState } from "react";
import axios from "axios";
import { CareersProvider } from "./careersContext";
import { AreasProvider } from "./areasContext";
import { DepartmentsProvider } from "./departmentsContext";
import { RolesProvider } from "./rolesContext";
import { ConfigurationProvider } from "./configurationContext";
import { MessagesProvider } from "./messagesContext";

const UsersContext = createContext();

function UsersProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");

  const fetchUsers = async () => {
    if (term === "") {
      try {
        const before = users;
        setIsLoading(true);
        setUsers([]);
        const res = await axios.get(
          `http://localhost:8000/v1/users?page=${page}&limit=15`
        );
        setTimeout(() => {
          if (res.data) {
            setUsers(res.data);
          } else {
            setUsers(before);
          }
          setIsLoading(false);
        }, 150);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  // eslint-disable-next-line
  const stableFetchUsers = useCallback(fetchUsers, [page, term]);

  const createUser = async (user) => {
    try {
      const res = await axios.post("http://localhost:8000/v1/users/add", user);
      const updatedUsers = [...users, res.data];
      setUsers(updatedUsers);
      return true;
    } catch (error) {
      return false;
    }
  };

  const createUsersByCSV = async (selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data) {
        const updatedUsers = [...users, ...res.data];
        setUsers(updatedUsers);
        return "Add";
      } else {
        return "Same";
      }
    } catch (error) {
      return "Error";
    }
  };

  const deleteUserById = async (id) => {
    const array = term === "" ? users : filteredUsers;
    const set = term === "" ? setUsers : setFilteredUsers;
    try {
      await axios.delete(`http://localhost:8000/v1/users/delete/${id}`);
      const updatedUsers = array.filter((user) => {
        return user._id !== id;
      });
      set(updatedUsers);
      return true;
    } catch (error) {
      return false;
    }
  };

  const editUserById = async (id, user) => {
    const array = term === "" ? users : filteredUsers;
    const set = term === "" ? setUsers : setFilteredUsers;
    try {
      let editedUser = {};
      const res = await axios.put(
        `http://localhost:8000/v1/users/update/${id}`,
        user
      );
      const updateUsers = array.map((user) => {
        if (user._id === id) {
          editedUser = JSON.parse(res.request.response);
          return { ...user, ...res.data };
        }
        return user;
      });

      set(updateUsers);
      return editedUser;
    } catch (error) {
      return false;
    }
  };

  const valueToShare = {
    users,
    filteredUsers,
    isLoading,
    page,
    searchTerm,
    term,
    setSearchTerm,
    setIsLoading,
    setFilteredUsers,
    deleteUserById,
    editUserById,
    createUser,
    stableFetchUsers,
    createUsersByCSV,
    setPage,
    setUsers,
    setTerm,
  };

  return (
    <UsersContext.Provider value={valueToShare}>
      <RolesProvider>
        <CareersProvider>
          <AreasProvider>
            <DepartmentsProvider>
              <ConfigurationProvider>
                <MessagesProvider>{children}</MessagesProvider>
              </ConfigurationProvider>
            </DepartmentsProvider>
          </AreasProvider>
        </CareersProvider>
      </RolesProvider>
    </UsersContext.Provider>
  );
}

export { UsersProvider };
export default UsersContext;