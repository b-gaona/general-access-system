import Route from "./components/Route";
import TablePage from "./pages/TablePage";
import RegisterPage from "./pages/RegisterPage";
import ModificationPage from "./pages/ModificationPage";
import IndexPage from "./pages/IndexPage";
import { Fragment } from "react";
import { UsersProvider } from "./context/usersContext";

function App() {
  return (
    <UsersProvider>
      <Fragment>
        <Route path="/">
          <IndexPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path="/status">
          <TablePage />
        </Route>
        <Route path="/users">
          <ModificationPage />
        </Route>
      </Fragment>
    </UsersProvider>
  );
}

export default App;
