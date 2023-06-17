import { createContext, useCallback, useState } from "react";
import axios from "axios";

const RolesContext = createContext();

function RolesProvider({ children }) {
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    axios.get("http://localhost:8000/v1/roles").then((res) => {
      const data = res.data;
      const currentArray = data.map((role) => {
        return { label: role.role, value: role._id };
      });
      setRoles(currentArray);
    });
  };

  const stableFetchRoles = useCallback(fetchRoles, []);

  const createRole = async (title) => {
    const res = await axios.post("http://localhost:8000/v1/roles", {
      title,
    });

    const updatedRoles = [...roles, res.data];
    setRoles(updatedRoles);
  };

  const deleteRoleById = async (id) => {
    await axios.delete(`http://localhost:8000/v1/roles/${id}`);
    const updatedRoles = roles.filter((role) => {
      return role.id !== id;
    });
    setRoles(updatedRoles);
  };

  const editRoleById = async (id, title) => {
    const res = await axios.put(`http://localhost:8000/v1/roles/${id}`, {
      title,
    });
    const updateRoles = roles.map((role) => {
      if (role.id === id) {
        return { ...role, ...res.data };
      }
      return role;
    });

    setRoles(updateRoles);
  };

  const valueToShare = {
    roles,
    deleteRoleById,
    editRoleById,
    createRole,
    stableFetchRoles,
  };

  return (
    <RolesContext.Provider value={valueToShare}>
      {children}
    </RolesContext.Provider>
  );
}

export { RolesProvider };
export default RolesContext;
