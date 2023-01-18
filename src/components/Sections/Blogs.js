import {
  Container,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Empty from "./Empty";
import BlogCard from "../Card/Blog";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";

const MyArticles = () => {
  const { token } = useAuth();

  const navigate = useNavigate();

  const { isLoading, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/blogs/user?limit=4`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  return (
    <Container minW="full">
      {
        data?.data?.total === 0 || !data?.data?.total
          ? <Empty />
          : (
            <Flex direction="column">
              <Text
                textAlign="center"
                fontWeight="extrabold"
                my={4}
              >
                My Articles
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
            </Flex>
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
          onClick={() => navigate("/dashboard")}
        >
          See More
        </Text>
        )
      }
    </Container>
  );
};

export default MyArticles;
