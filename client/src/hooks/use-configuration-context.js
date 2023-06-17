import { useContext } from "react";
import ConfigurationContext from "../context/configurationContext";

function useConfigurationContext() {
  return useContext(ConfigurationContext);
}

export default useConfigurationContext;
