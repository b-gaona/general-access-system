import { createContext, useEffect } from "react";
import useRolesContext from "../hooks/use-roles-context";
import useCareersContext from "../hooks/use-careers-context";
import useDepartmentsContext from "../hooks/use-departments-context";
import moment from "moment";
import "moment/locale/es";

const ConfigurationContext = createContext();

function ConfigurationProvider({ children }) {
  const { stableFetchRoles, roles } = useRolesContext();
  const { stableFetchCareers, careers } = useCareersContext();
  const { stableFetchDepartments, departments } = useDepartmentsContext();
  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    stableFetchRoles();
  }, [stableFetchRoles]);

  useEffect(() => {
    stableFetchCareers();
  }, [stableFetchCareers]);

  useEffect(() => {
    stableFetchDepartments();
  }, [stableFetchDepartments]);

  //If you're using select tag instead of input tag. In the type property of the input value type 'select'.
  //In the input object the property is related to the objectConfig. You must type the matched property

  //Array that contains all of the inputs of the form and its required information
  const config = [
    {
      label: "Cargo en la universidad",
      input: {
        type: "select",
        property: "role",
        data: roles,
        placeholder: "Selecciona tu cargo",
      },
    },
    {
      label: "Número de empleado o matrícula",
      input: {
        type: "text",
        property: "plate",
        placeholder: "ej: 2116109066",
      },
    },
    {
      label: "Nombre empezando por apellidos",
      input: {
        type: "text",
        property: "name",
        placeholder: "ej: Peréz Galván Miguel Alberto",
      },
    },
    {
      label: "Carrera",
      input: {
        type: "select",
        property: "career",
        data: careers,
        placeholder: "Selecciona tu carrera",
      },
    },
    {
      label: "Área",
      input: {
        type: "select",
        property: "area",
        data: [
          { label: "", value: "" },
          { label: "", value: "" },
        ],
        placeholder: "Selecciona tu área",
      },
    },
    {
      label: "Departamento",
      input: {
        type: "select",
        property: "department",
        data: departments,
        placeholder: "Selecciona tu departamento",
      },
    },
  ];

  //Array used to decide how to show the information on a table.
  const renderedConfig = [
    {
      label: "ID",
      render: (user) => user.plate,
      sortValue: (user) => user.plate,
    },
    {
      label: "Cargo",
      render: (user) => user.role.role,
      sortValue: (user) => user.role.role,
    },
    {
      label: "Nombre completo",
      render: (user) => user.name,
      sortValue: (user) => user.name,
    },
    {
      label: "Carrera",
      render: (user) => {
        try {
          return user.career.career;
        } catch (error) {
          return "N/A";
        }
      },
      value: (user) => {
        try {
          return user.career._id;
        } catch (error) {
          return "N/A";
        }
      },
      sortValue: (user) => {
        try {
          return user.career.career;
        } catch (error) {}
      },
    },
    {
      label: "Área",
      render: (user) => {
        try {
          return user.area.area;
        } catch (error) {
          return "N/A";
        }
      },
      value: (user) => {
        try {
          return user.area._id;
        } catch (error) {
          return "N/A";
        }
      },
      sortValue: (user) => {
        try {
          return user.area.area;
        } catch (error) {}
      },
    },
    {
      label: "Departamento",
      render: (user) => {
        try {
          return user.department.department;
        } catch (error) {
          return "N/A";
        }
      },
      value: (user) => {
        try {
          return user.department._id;
        } catch (error) {
          return "N/A";
        }
      },
      sortValue: (user) => {
        try {
          return user.department.department;
        } catch (error) {}
      },
    },
    {
      label: "Fecha",
      render: (user) => moment(user.date).local("es").format("LLL"),
      sortValue: (user) => user.date,
    },
  ];

  //Object used to decide in the dropdowns logic, the properties must match with the object config and the labels must match with the role's dropdown's label.
  const propertiesConfig = {
    ROLE_PROPERTY: "role",
    PLATE_PROPERTY: "plate",
    NAME_PROPERTY: "name",
    CAREER_PROPERTY: "career",
    AREA_PROPERTY: "area",
    DEPARTMENT_PROPERTY: "department",
    TEACHER_LABEL: "Docente",
    ADMIN_LABEL: "Administrativo",
    STUDENT_LABEL: "Alumno",
  };

  //Object with all the possible properties of the form (property names MUST match to the config array)
  const objectConfig = {
    role: "",
    plate: "",
    name: "",
    career: "",
    area: "",
    department: "",
  };

  //Key property of the object (_id is gotten by the DB)
  const keyFn = (user) => {
    return user._id;
  };

  const valuesToShare = {
    BASE_URL,
    config,
    objectConfig,
    renderedConfig,
    keyFn,
    roles,
    careers,
    departments,
    ...propertiesConfig,
  };

  return (
    <ConfigurationContext.Provider value={valuesToShare}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export { ConfigurationProvider };
export default ConfigurationContext;
