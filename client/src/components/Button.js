import className from "classnames";

function Button({
  children,
  primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  rounded,
  ...rest
}) {
  const classes = className(
    rest.className,
    "flex items-center gap-x-2 px-3 py-1 border justify-center rounded-sm",
    {
      "border-blue-500 bg-blue-500 hover:bg-blue-700 ease-in-out duration-300 text-white":
        primary, //If primary is true it add that class
      "border-gray-900 bg-gray-900 hover:bg-gray-950 ease-in-out duration-300 text-white":
        secondary,
      "border-emerald-600 bg-emerald-600 hover:bg-emerald-800 ease-in-out duration-300 text-white":
        success,
      "border-yellow-400 bg-yellow-400 hover:bg-yellow-700 ease-in-out duration-300 text-white":
        warning,
      "border-red-500 bg-red-500 hover:bg-red-700 ease-in-out duration-300 text-white":
        danger,
      "rounded-full": rounded,
      "bg-white": outline,
      "text-blue-500": outline && primary,
      "text-gray-900": outline && secondary,
      "text-emerald-600": outline && success,
      "text-yellow-400": outline && warning,
      "text-red-500": outline && danger,
    }
  );
  //Wrapper
  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  ); //Underlying element
}

Button.propTypes = {
  checkVariationValue: ({ primary, secondary, success, warning, danger }) => {
    const count =
      Number(!!primary) +
      Number(!!secondary) +
      Number(!!success) +
      Number(!!warning) +
      Number(!!danger);
    if (count > 1) {
      return new Error(
        "Only one of primary, secondary, success, warning, danger can be true"
      );
    }
  },
};

export default Button;
