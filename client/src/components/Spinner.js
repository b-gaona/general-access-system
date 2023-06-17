function Spinner({ type }) {
  const spinnerType = {
    cloud: { parent: "", child: "cloud" },
    loading: { parent: "h-14", child: "loading" },
  };

  return (
    <div
      className={`flex justify-center items-center ${spinnerType[type].parent}`}
    >
      <span className={`${spinnerType[type].child} z-40`}></span>{" "}
    </div>
  );
}

export default Spinner;
