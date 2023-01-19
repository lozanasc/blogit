import React from "react";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Container,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Empty from "./Empty";
import BlogCard from "../Card/Blog";

import useFetch from "../../hooks/useFetch";

const Featured = () => {
  const { isLoading, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/blogs?limit=4`, { withCredentials: true });

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box m="auto" py={32}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Container
      minW="full"
      py={12}
    >
      {
        data?.data?.total === 0 || !data?.data?.total
          ? <Empty />
          : (
            <>
              <Text
                textAlign="center"
                fontWeight="extrabold"
                my={4}
              >
                Featured Articles
              </Text>
              <Flex
                w="full"
                flexDir={["column", "column", "row"]}
                justify={data?.data?.total >= 4 && "space-evenly"}
                gap={2}
              >
                {
            data?.data?.data?.map((blog) => (
              <BlogCard
                m={["auto", "auto", "auto", 0]}
                key={blog?.id}
                id={blog?.id}
                bgSrc={`${process.env.REACT_APP_TEST_URL}${blog?.cover_picture_url}`}
                createdAt={new Date(blog?.created_at).toDateString()}
                title={blog?.title}
                author={blog?.author}
                authorProfile={`${process.env.REACT_APP_TEST_URL}${blog?.author_profile}`}
              />
            ))
          }
              </Flex>
            </>
          )
      }
      {
        data?.data?.total > 0
        && (
        <Text
          as={motion.div}
          whileHover={{ scale: 1.2, fontWeight: "bold" }}
          maxW="fit-content"
          py={12}
          m="auto"
          cursor="pointer"
          onClick={() => navigate("/blogs")}
        >
          See All
        </Text>
        )
      }
    </Container>
  );
};

export default Featured;
