import { createContext, useCallback, useState } from "react";
import axios from "axios";
import useConfigurationContext from "../hooks/use-configuration-context";

const CareersContext = createContext();

function CareersProvider({ children }) {
  const { BASE_URL } = useConfigurationContext();
  const [careers, setCareers] = useState([]);

  const fetchCareers = async () => {
    axios.get(`${BASE_URL}/v1/careers`).then((res) => {
      const data = res.data;
      const currentArray = data.map((career) => {
        return { label: career.career, value: career._id };
      });
      setCareers(currentArray);
    });
  };

  const stableFetchCareers = useCallback(fetchCareers, []);

  const createCareer = async (title) => {
    const res = await axios.post(`${BASE_URL}/v1/careers`, {
      title,
    });

    const updatedCareers = [...careers, res.data];
    setCareers(updatedCareers);
  };

  const deleteCareerById = async (id) => {
    await axios.delete(`${BASE_URL}/v1/careers/${id}`);
    const updatedCareers = careers.filter((career) => {
      return career.id !== id;
    });
    setCareers(updatedCareers);
  };

  const editCareerById = async (id, title) => {
    const res = await axios.put(`${BASE_URL}/v1/careers/${id}`, {
      title,
    });
    const updateCareers = careers.map((career) => {
      if (career.id === id) {
        return { ...career, ...res.data };
      }
      return career;
    });

    setCareers(updateCareers);
  };

  const valueToShare = {
    careers,
    deleteCareerById,
    editCareerById,
    createCareer,
    stableFetchCareers,
  };

  return (
    <CareersContext.Provider value={valueToShare}>
      {children}
    </CareersContext.Provider>
  );
}

export { CareersProvider };
export default CareersContext;
