import { useContext } from "react";
import CareersContext from "../context/careersContext";

function useCareersContext() {
  return useContext(CareersContext);
}

export default useCareersContext;
