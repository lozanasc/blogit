import React from "react";
import {
  Button,
  Heading,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import LogoCenteredDark from "../assets/logo-centered-dark.svg";
import LogoCenteredLight from "../assets/logo-centered-light.svg";

const NotFound = () => {
  const navigate = useNavigate();

  const logoSrc = useColorModeValue(LogoCenteredLight, LogoCenteredDark);

  const bg = useColorModeValue("brand.base-dark", "brand.base-light");
  const color = useColorModeValue("brand.base-light", "brand.base-dark");

  const handleClick = () => {
    navigate("/");
  };

  return (
    <VStack minHeight="100vh">
      <VStack m="auto" gap={2}>
        <Image src={logoSrc} />
        <Heading size="xl">404</Heading>
        <Text as="h2" size="lg">PAGE NOT FOUND</Text>
        <Button
          bg={bg}
          color={color}
          onClick={handleClick}
        >
          Go Home
        </Button>
      </VStack>
    </VStack>
  );
};

export default NotFound;
