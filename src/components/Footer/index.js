import React from "react";
import {
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import LogoCenteredDark from "../../assets/logo-centered-dark.svg";
import LogoCenteredLight from "../../assets/logo-centered-light.svg";

const Footer = () => {
  const footerBg = useColorModeValue("#FAFAF9", "#1E1E1E");
  const logoSrc = useColorModeValue(LogoCenteredLight, LogoCenteredDark);

  return (
    <Flex
      mt="auto"
      bgColor={footerBg}
      p={[8, 8, 16]}
      w="full"
      justify="space-between"
    >
      <Flex
        direction="column"
        gap={2}
        dropShadow="dark-lg"
      >
        <Image
          src={logoSrc}
          height={[6, 6, 12]}
          mx="auto"
        />
        <Text
          align="center"
          fontSize={["xs", "xs", "sm"]}
        >
          Privacy | Terms
        </Text>
      </Flex>
      <Text
        align="center"
        fontSize={["xx-small", "xx-small", "sm"]}
        my="auto"
      >
        Stratpoint University © 2023
      </Text>
      <Flex
        direction="column"
        gap={2}
        dropShadow="dark-lg"
      >
        <Text
          align="center"
          fontSize={["xs", "xs", "sm"]}
        >
          Contact Me
        </Text>
        <Link
          fontSize={["xs", "xs", "xs"]}
          href="https://github.com/lozanasc"
        >
          Who am I?
        </Link>
        <Link
          fontSize={["xs", "xs", "xs"]}
          href="https://github.com/lozanasc/blogit"
        >
          About this Project
        </Link>
      </Flex>
    </Flex>
  );
};

export default Footer;
