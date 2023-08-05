import Link from "./Link";
import Button from "./Button";

function Sidebar() {
  const links = [
    {
      textToShow: "Ver todo",
      path: "/modifications",
    },
    {
      textToShow: "Alumno",
      path: "/",
    },
    {
      textToShow: "Administrativo",
      path: "/",
    },
    {
      textToShow: "Docente",
      path: "/",
    },
    {
      textToShow: "Carrera",
      path: "/",
    },
    {
      textToShow: "Área",
      path: "/",
    },
    {
      textToShow: "Departamento",
      path: "/",
    },
  ];

  const renderedLinks = links.map((link) => {
    return (
      <Link
        activeClassName="font-bold border-l-4 border-blue-500 pl-2"
        className="mb-3"
        key={link.textToShow}
        to={link.path}
      >
        {link.textToShow}
      </Link>
    );
  });

  return (
    <div className="sticky top-0 flex flex-col items-start">
      {renderedLinks}
      <Button className="w-full" primary>
        Filtrar
      </Button>
    </div>
  );
}

export default Sidebar;
