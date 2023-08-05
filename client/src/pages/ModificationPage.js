import { useEffect } from "react";

import SortableTable from "../components/SortableTable";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

import useUsersContext from "../hooks/use-users-context";

import useConfigurationContext from "../hooks/use-configuration-context";
import Skeleton from "../components/Skeleton";
import ImportSection from "../components/ImportSection";
import Paginator from "../components/Paginator";

function ModificationPage() {
  const { stableFetchUsers, users, filteredUsers, isLoading, term } =
    useUsersContext();
  const { renderedConfig, keyFn } = useConfigurationContext();

  useEffect(() => {
    stableFetchUsers();
  }, [stableFetchUsers]);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <h1 className="text-3xl uppercase text-center font-semibold">
        Tabla de usuarios
      </h1>
      <div className="mx-16 flex items-center flex-col">
        <div className="flex gap-7 justify-center items-center w-full p-2">
          <SearchBar collection="users" />
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <SortableTable
            data={term !== "" ? filteredUsers : users}
            config={renderedConfig}
            keyFn={keyFn}
            loader={
              isLoading && <Skeleton times={10} className="h-12 w-full" />
            }
            showInfo
          />
          <Paginator />
        </div>
        <ImportSection />
      </div>
      <Footer />
    </div>
  );
}

export default ModificationPage;

//TODO: Add the user deleted in Form message
//TODO: Fix the arrows in paginator (min and max)
//FIXME: Create a component for a table with paginator, sortable table, table with row info, and normal table
//FIXME: Messages when importing, removing and exporting records
