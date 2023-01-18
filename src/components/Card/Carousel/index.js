import { Box, Link, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import React from "react";

const CardCarousel = ({ id, bgSrc, title }) => (
  <Box
    as={motion.div}
    whileHover={{ scale: 1.05 }}
    backgroundImage={
    `linear-gradient(
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.4)
    ),
    url(${bgSrc})`
    }
    minH={245}
    minW={512}
    maxH={245}
    maxW={512}
    backgroundPosition="center"
    backgroundSize="cover"
    display="flex"
    boxShadow="dark-lg"
    rounded="lg"
    p={6}
  >
    <Link
      fontSize={["md", "md", "2xl"]}
      as={RouterLink}
      to={`/blog/${id}`}
      color="white"
      m="auto"
      cursor="pointer"
    >
      <Text
        textAlign="center"
        noOfLines={2}
      >
        {title}
      </Text>
    </Link>
  </Box>
);

export default CardCarousel;
