import { useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "./Button";

function Modal({ children, actionBar, onClose }) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      className="fixed top-2/4 left-2/4 w-full h-full flex justify-center items-center"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-30 -z-30"
      ></div>
      <div className="bg-gray-100 shadow-lg border border-gray-300 shadow-black p-10 py-4 rounded-lg max-w-md">
        <div className="flex justify-end">
          <Button
            className="w-8 font-semibold text-gray-500 hover:text-gray-700 border-0 ease-in-out duration-300"
            onClick={onClose}
          >
            X
          </Button>
        </div>
        {children}
        {actionBar && (
          <div className="flex justify-center mt-8">{actionBar}</div>
        )}
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}

export default Modal;
