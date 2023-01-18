import {
  Box,
  Text,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import React from "react";

const Empty = () => {
  const boxBg = useColorModeValue("#D9D9D9", "#1E1E1E");
  const boxColor = useColorModeValue("#1E1E1E", "white");

  const buttonBg = useColorModeValue("brand.base-dark", "brand.base-light");
  const buttonColor = useColorModeValue("brand.base-light", "brand.base-dark");

  return (
    <Box
      bgColor={boxBg}
      color={boxColor}
      display="flex"
      flexDir="column"
      minW="full"
      px={[6, 6, 8]}
      py={[4, 4, 6]}
      rounded="lg"
      gap={2}
    >
      <Text fontWeight="extrabold" fontSize={["xs", "base", "md"]}>
        Its getting dusty in here 🌵
      </Text>
      <Text fontSize={["xs", "base", "md"]}>
        {/* eslint-disable-next-line max-len */}
        The quick brown fox jumps over the lazy writer who wont write content because we are for a million time... procrastinating...
      </Text>
      <Button
        size={["xs", "xs", "md"]}
        ml="auto"
        bg={buttonBg}
        color={buttonColor}
        fontWeight="extrabold"
        fontFamily="heading"
        onClick={() => {}}
      >
        Lets write
      </Button>
    </Box>
  );
};

export default Empty;
