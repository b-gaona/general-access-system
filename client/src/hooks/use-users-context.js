import { useContext } from "react";
import UsersContext from "../context/usersContext";

function useUsersContext() {
  return useContext(UsersContext);
}

export default useUsersContext;
