import Footer from "../components/Footer";
import Header from "../components/Header";
import MenuCard from "../components/MenuCard";
import register from "../img/register.webp";
import students from "../img/students.webp";
import arriveStatus from "../img/arriveStatus.webp";
import { useEffect } from "react";
import useUsersContext from "../hooks/use-users-context";

function IndexPage() {
  const { setFilteredUsers, setTerm, setSearchTerm } = useUsersContext();

  useEffect(() => {
    setFilteredUsers([]);
    setTerm("");
    setSearchTerm("");
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header></Header>
      <div className="flex flex-wrap justify-center items-stretch gap-10">
        <MenuCard
          img={register}
          alt="Registro de usuarios"
          heading="Registro de usuarios"
          to="/register"
        ></MenuCard>
        <MenuCard
          img={students}
          alt="Tabla de usuarios"
          heading="Tabla de usuarios"
          to="/users"
        ></MenuCard>
        <MenuCard
          img={arriveStatus}
          alt="Entrada de usuarios"
          heading="Entrada de usuarios"
          to="/status"
        ></MenuCard>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default IndexPage;
