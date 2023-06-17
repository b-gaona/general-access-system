import { useContext } from "react";
import AreasContext from "../context/areasContext";

function useAreasContext() {
  return useContext(AreasContext);
}

export default useAreasContext;
