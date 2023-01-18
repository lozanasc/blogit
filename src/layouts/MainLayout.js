/* eslint-disable arrow-body-style */
import React from "react";
import { Outlet } from "react-router-dom";
import { VStack } from "@chakra-ui/react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <VStack
      minH="full"
      minW="full"
    >
      <Navigation />
      <Outlet />
      <Footer />
    </VStack>
  );
};

export default MainLayout;
