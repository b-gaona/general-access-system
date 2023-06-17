import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import useUsersContext from "../hooks/use-users-context";

function Paginator() {
  const { page, setPage } = useUsersContext();
  const handleLeftClick = () => {
    setPage((curr) => {
      if (curr > 1) {
        return curr - 1;
      } else {
        return curr;
      }
    });
  };

  const handleRightClick = () => {
    setPage((curr) => curr + 1);
  };

  return (
    <div className="flex gap-3 py-5">
      <GoArrowLeft
        className="w-7 h-7 cursor-pointer"
        onClick={handleLeftClick}
      />
      <p>{page}</p>
      <GoArrowRight
        className="w-7 h-7 cursor-pointer"
        onClick={handleRightClick}
      />
    </div>
  );
}

export default Paginator;
