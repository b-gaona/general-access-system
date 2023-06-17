import Panel from "./Panel";

function Dropdown({ options, currentValue, onChange, property, placeholder }) {
  const handleOptionClick = (option) => {
    onChange({ ...option, property });
  };

  const renderedOptions = options.map((option) => {
    const { label, value } = option;

    return (
      <option
        key={label}
        className="hover:bg-sky-100 ease-in-out duration-300 cursor-pointer w-100"
        style={{ all: "none" }}
        value={value}
      >
        {label}
      </option>
    );
  });

  return (
    <div>
      <Panel className="bg-white w-full" style={{padding: "0px"}}>
        <select
          onChange={(evt) =>
            handleOptionClick({
              value: evt.target.value,
              label: evt.target.options[evt.target.selectedIndex].text,
              property,
            })
          }
          className="w-full rounded cursor-pointer active:outline-none p-3"
          value={currentValue}
          required
        >
          <option value="">{placeholder || "Selecciona una opción"}</option>
          {renderedOptions}
        </select>
      </Panel>
    </div>
  );
}

export default Dropdown;
