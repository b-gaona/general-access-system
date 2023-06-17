import { useContext } from "react";
import RolesContext from "../context/rolesContext";

function useRolesContext() {
  return useContext(RolesContext);
}

export default useRolesContext;
