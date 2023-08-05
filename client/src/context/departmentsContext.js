import { createContext, useCallback, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const DepartmentsContext = createContext();

function DepartmentsProvider({ children }) {
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    axios.get(`${BASE_URL}/v1/departments`).then((res) => {
      const data = res.data;
      const currentArray = data.map((department) => {
        return { label: department.department, value: department._id };
      });
      setDepartments(currentArray);
    });
  };

  const stableFetchDepartments = useCallback(fetchDepartments, []);

  const createDepartment = async (title) => {
    const res = await axios.post(`${BASE_URL}/v1/departments`, {
      title,
    });

    const updatedDepartments = [...departments, res.data];
    setDepartments(updatedDepartments);
  };

  const deleteDepartmentById = async (id) => {
    await axios.delete(`${BASE_URL}/v1/departments/${id}`);
    const updatedDepartments = departments.filter((department) => {
      return department.id !== id;
    });
    setDepartments(updatedDepartments);
  };

  const editDepartmentById = async (id, title) => {
    const res = await axios.put(`${BASE_URL}/v1/departments/${id}`, {
      title,
    });
    const updateDepartments = departments.map((department) => {
      if (department.id === id) {
        return { ...department, ...res.data };
      }
      return department;
    });

    setDepartments(updateDepartments);
  };

  const valueToShare = {
    departments,
    deleteDepartmentById,
    editDepartmentById,
    createDepartment,
    stableFetchDepartments,
  };

  return (
    <DepartmentsContext.Provider value={valueToShare}>
      {children}
    </DepartmentsContext.Provider>
  );
}

export { DepartmentsProvider };
export default DepartmentsContext;
