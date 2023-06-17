import Footer from "../components/Footer";
import Header from "../components/Header";
import MenuCard from "../components/MenuCard";
import register from "../img/register.webp";
import students from "../img/students.webp";
import arriveStatus from "../img/arriveStatus.webp";

function IndexPage(params) {
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
          alt="Entrada y salida de usuarios"
          heading="Entrada y salida de usuarios"
          to="/status"
        ></MenuCard>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default IndexPage;
