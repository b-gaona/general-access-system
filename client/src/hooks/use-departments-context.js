import { useContext } from "react";
import DepartmentsContext from "../context/departmentsContext";

function useDepartmentsContext() {
  return useContext(DepartmentsContext);
}

export default useDepartmentsContext;
