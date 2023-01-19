import { useRoutes } from "react-router-dom";

import appRoutes from "./routes";
import useAuth from "./hooks/useAuth";

const App = () => {
  const { isAuthenticated } = useAuth();

  const appRouting = useRoutes(appRoutes(isAuthenticated));

  return appRouting;
};

export default App;
