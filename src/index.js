import "@fontsource/montserrat";
import "@fontsource/inter";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import theme from "./theme";

import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthContextProvider>
          <ColorModeScript initialColorMode="system" />
          <App />
        </AuthContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
);
