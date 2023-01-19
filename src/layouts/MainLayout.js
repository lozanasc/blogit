/* eslint-disable arrow-body-style */
import React from "react";
import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <Flex direction="column">
      <Navigation />
      <Outlet />
      <Footer />
    </Flex>
  );
};

export default MainLayout;
