import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import useConfigurationContext from "../hooks/use-configuration-context";

function Form({ config, objectConfig, onSubmit, children, buttonInfo }) {
  const [user, setUser] = useState(objectConfig);
  const [secondData, setSecondData] = useState([]); //Only needed if you have dependent dropdowns
  const [selectedRole, setSelectedRole] = useState(""); //Used to decide which items to render (which fields in the form)
  const {
    CAREER_PROPERTY,
    ROLE_PROPERTY,
    AREA_PROPERTY,
    ADMIN_LABEL,
    DEPARTMENT_PROPERTY,
    TEACHER_LABEL,
    BASE_URL
  } = useConfigurationContext();

  useEffect(() => {
    //Fill up the form
    if (!Object.values(objectConfig).some((element) => !element)) {
      if (objectConfig.area) {
        axios
          .get(`${BASE_URL}/v1/careers/get/${objectConfig.career}`)
          .then((res) => {
            const data = res.data.areas;
            const renderedData = data.map(({ area, _id }) => {
              return { label: area, value: _id };
            });
            setSecondData(renderedData);
          })
          .catch((err) => setSecondData([]));
      }

      setSelectedRole(objectConfig.role_label);
    }

    //Until the data of the independent dropdown has been removed (or the user has been added)
    if (objectConfig.area === "" && objectConfig.career === "") {
      setSecondData([]);
    }
    setUser(objectConfig);
  }, [objectConfig]);

  const handleSelectChange = (option) => {
    const { label, value, property } = option;

    //This conditional is needed if you want to do a dependent dropdown, the "career" property is of the independent dropdown
    if (property === CAREER_PROPERTY) {
      axios
        .get(`${BASE_URL}/v1/careers/get/${value}`)
        .then((res) => {
          const data = res.data.areas;
          const renderedData = data.map(({ area, _id }) => {
            return { label: area, value: _id };
          });
          setSecondData(renderedData);
        })
        .catch((err) => setSecondData([]));
    }

    //We use the onChange function to clear the values of the parent object and only return the role value
    if (property === ROLE_PROPERTY) {
      setSelectedRole(label);
      setUser({
        role: value,
        plate: "",
        name: "",
        career: "",
        area: "",
        department: "",
      });
      setSecondData([]);
    }

    //The ending with '_label' refers to the label of the selected option
    setUser((curr) => {
      return { ...curr, [property]: value, [property + "_label"]: label };
    });
  };

  const handleInputChange = (value) => {
    const { text, property } = value;
    setUser((curr) => {
      return { ...curr, [property]: text };
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit(user);
  };

  const renderedItems = config.map((element) => {
    let {
      input: { type, data, property, placeholder },
      label,
    } = element;

    if (
      (selectedRole !== ADMIN_LABEL && property === DEPARTMENT_PROPERTY) ||
      (selectedRole === ADMIN_LABEL && property === CAREER_PROPERTY) ||
      ((selectedRole === TEACHER_LABEL || selectedRole === ADMIN_LABEL) &&
        property === AREA_PROPERTY)
    ) {
      // eslint-disable-next-line
      return;
    }

    //This is do indicate the property of the dependent dropdown to change the current data to the fetch of above
    if (property === AREA_PROPERTY) {
      data = secondData || data;
    }

    const ddLogic = {
      onChange: handleSelectChange,
      currentValue: user[property],
      options: data,
      property,
      placeholder,
    };

    const inpLogic = {
      property,
      value: user[property],
      onChange: handleInputChange,
      placeholder,
    };

    const input =
      type !== "select" ? (
        <Input
          className="border rounded-lg text-lg py-1 indent-3 w-full"
          {...inpLogic}
        />
      ) : (
        <Dropdown className="text-lg" {...ddLogic} />
      );

    return (
      <fieldset className="flex flex-col" key={label}>
        <label className="text-lg" htmlFor={property}>
          {label}
        </label>
        {input}
      </fieldset>
    );
  });

  return (
    <form
      className="flex flex-col justify-between gap-4 w-full"
      onSubmit={handleSubmit}
    >
      {children}
      {renderedItems}
      <Button className="text-lg justify-center rounded-md mt-5 w-full" success>
        {buttonInfo}
      </Button>
    </form>
  );
}

export default Form;
