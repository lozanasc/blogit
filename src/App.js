import { useRoutes } from "react-router-dom";

import { Container } from "@chakra-ui/react";
import appRoutes from "./routes";
import useAuth from "./hooks/useAuth";

const App = () => {
  const { isAuthenticated } = useAuth();

  const appRouting = useRoutes(appRoutes(isAuthenticated));

  return (
    <Container
      minH="100vh"
      minW="100%"
      m={0}
      p={0}
    >
      { appRouting }
    </Container>
  );
};

export default App;
