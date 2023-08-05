import { createContext, useCallback, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const AreasContext = createContext();

function AreasProvider({ children }) {
  const [areas, setAreas] = useState([]);

  const fetchAreas = async () => {
    const res = await axios.get(`${BASE_URL}/v1/areas`);
    setAreas(res.data);
  };

  const stableFetchAreas = useCallback(fetchAreas, []);

  const createdArea = async (title) => {
    const res = await axios.post(`${BASE_URL}/v1/areas`, {
      title,
    });

    const updatedAreas = [...areas, res.data];
    setAreas(updatedAreas);
  };

  const deletedAreaById = async (id) => {
    await axios.delete(`${BASE_URL}/v1/areas/${id}`);
    const updatedAreas = areas.filter((area) => {
      return area.id !== id;
    });
    setAreas(updatedAreas);
  };

  const editdAreaById = async (id, title) => {
    const res = await axios.put(`${BASE_URL}/v1/areas/${id}`, {
      title,
    });
    const updateAreas = areas.map((area) => {
      if (area.id === id) {
        return { ...area, ...res.data };
      }
      return area;
    });

    setAreas(updateAreas);
  };

  const valueToShare = {
    areas,
    deletedAreaById,
    editdAreaById,
    createdArea,
    stableFetchAreas,
  };

  return (
    <AreasContext.Provider value={valueToShare}>
      {children}
    </AreasContext.Provider>
  );
}

export { AreasProvider };
export default AreasContext;
