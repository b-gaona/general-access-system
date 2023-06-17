function Input({ value, onChange, property, ...rest }) {
  const handleChange = (evt) => {
    onChange({ text: evt.target.value, property });
  };

  return (
    <input
      {...rest}
      id={property}
      value={value}
      onChange={handleChange}
      required
    />
  );
}

export default Input;
