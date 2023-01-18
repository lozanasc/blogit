import React from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({
  id, bgSrc, title, createdAt, author, authorProfile, ...rest
}) => {
  const navigate = useNavigate();

  return (
    <Box
      {...rest}
      as={motion.div}
      whileHover={{ scale: 1.05 }}
      cursor="pointer"
      h={[277, 337, 312, 410]}
      w={[260, 316, 256, 320]}
      display="flex"
      flexDir="column"
      rounded="lg"
      bgColor={useColorModeValue("#D9D9D9", "#313131")}
      color={useColorModeValue("brand.base-dark", "brand.base-light")}
      boxShadow="xl"
      onClick={() => navigate(`/blog/${id}`)}
    >
      <Image
        rounded="lg"
        h="50%"
        src={bgSrc}
        backgroundPosition="center"
        backgroundSize="cover"
      />
      <Box
        h="50%"
        display="flex"
        flexDir="column"
        px={6}
        py={3}
      >
        <Text fontSize={["xs", "xs", "sm", "base"]}>
          {createdAt}
        </Text>
        <Heading fontSize={["sm", "md", "md", "lg"]} my="auto" noOfLines={2}>
          {title}
        </Heading>
        <Flex mt="auto">
          <Avatar size={["xs", "xs", "sm"]} src={authorProfile} />
          <Text
            ml={2}
            my="auto"
            fontSize={["xs", "xs", "sm", "base"]}
          >
            {author}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default BlogCard;
