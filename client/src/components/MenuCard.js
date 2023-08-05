import useNavigation from "../hooks/use-navigation";

function MenuCard({ img, alt, heading, to }) {
  const { navigate } = useNavigation();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <div
      className="card bg-gray-100 text-center rounded-lg shadow-md transition-all duration-200 ease-in hover:cursor-pointer hover:border-emerald-600 hover:border-4 hover:scale-105 w-72 h-auto"
      onClick={handleClick}
    >
      <div>
        <img src={img} alt={alt} className="rounded-t-lg" />
      </div>
      <div className="flex items-center justify-center p-6">
        <h3 className="text-3xl">{heading}</h3>
      </div>
    </div>
  );
}

export default MenuCard;
