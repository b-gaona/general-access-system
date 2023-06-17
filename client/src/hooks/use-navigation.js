import { useContext } from "react";
import NavigationContext from "../context/navigationContext";

function useNavigation() {
  return useContext(NavigationContext);
}

export default useNavigation;
