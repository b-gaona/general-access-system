import { createContext } from "react";

const MessagesContext = createContext();

function MessagesProvider({ children }) {
  const ERROR_MESSAGE = (
    <div>
      <h1 className="text-center text-xl my-3 bg-red-500 text-white py-1 rounded">
        Hubo un error, inténtelo de nuevo
      </h1>
    </div>
  );

  const USER_MESSAGE = {
    ADD: (
      <h1 className="text-center text-xl my-3 bg-green-500 text-white py-1 rounded">
        Usuario ingresado correctamente
      </h1>
    ),
    EDIT: (
      <h1 className="text-center text-xl my-3 bg-green-500 text-white py-1 rounded">
        Usuario editado correctamente
      </h1>
    ),
    DELETE: (
      <h1 className="text-center text-xl my-3 bg-green-500 text-white py-1 rounded">
        Usuario eliminado correctamente
      </h1>
    ),
    CARD: (
      <h1 className="text-center text-xl my-3 bg-green-500 text-white py-1 rounded">
        Credencial asignada correctamente
      </h1>
    ),
  };

  const IMPORT_MESSAGE = {
    SUCCESS: (
      <div className="flex justify-center">
        <h1 className="text-center text-xl my-3 bg-green-500 text-white py-1 rounded w-2/4">
          El archivo ha sido importado exitosamente
        </h1>
      </div>
    ),
    NO_CHANGES: (
      <div className="flex justify-center">
        <h1 className="text-center text-xl my-3 bg-yellow-500 text-white py-1 rounded w-2/4">
          No hay datos que se puedan importar
        </h1>
      </div>
    ),
    INCOMPLETE: (
      <div className="flex justify-center">
        <h1 className="text-center text-xl my-3 bg-yellow-500 text-white py-1 rounded w-2/4">
          El archivo ha sido importado correctamente, excepto las duplicaciones de registros.
        </h1>
      </div>
    ),
    ERROR: (
      <div className="flex justify-center">
        <h1 className="text-center text-xl my-3 bg-red-500 text-white py-1 rounded w-2/4">
          Error al cargar e importar el archivo.
        </h1>
      </div>
    ),
  };

  const valuesToShare = {
    ERROR_MESSAGE,
    USER_MESSAGE,
    IMPORT_MESSAGE,
  };

  return (
    <MessagesContext.Provider value={valuesToShare}>
      {children}
    </MessagesContext.Provider>
  );
}

export { MessagesProvider };
export default MessagesContext;
