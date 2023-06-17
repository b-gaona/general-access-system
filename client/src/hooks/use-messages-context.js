import { useContext } from "react";
import MessagesContext from "../context/messagesContext";

function useMessagesContext() {
  return useContext(MessagesContext);
}

export default useMessagesContext;
