import logo from "../img/uttn.png";

function Header() {
  return (
    <header className="mb-6 h-28 flex items-center">
      <div className="h-12 bg-emerald-600 flex justify-center w-full">
        <div className="bg-white w-80 text-center relative -top-6 h-32 flex justify-center items-center">
          <img
            src={logo}
            className="w-4/6"
            alt=" Uttn logo"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
