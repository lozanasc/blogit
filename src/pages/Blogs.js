import React, { useState } from "react";
import {
  Flex,
  Spinner,
  Button,
  Text,
  Heading,
} from "@chakra-ui/react";
import BlogCard from "../components/Card/Blog";

import useFetch from "../hooks/useFetch";

const Blogs = () => {
  const [query, setQuery] = useState("");

  const { isLoading, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/blogs?limit=6${query}`);

  if (data?.data?.total === 0) {
    return (
      <Heading align="center">
        Start writing 📝
      </Heading>
    );
  }

  return (
    <Flex
      minW="full"
      py={12}
    >
      <Flex
        display="flex"
        flexDir={["column", "column", "row"]}
        m="auto"
        justify="center"
        flexWrap="wrap"
        px={12}
        gap={12}
      >
        {isLoading && <Spinner mx="auto" size="xl" />}
        {
          data?.data?.data?.map((blog) => (
            <BlogCard
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
        <Flex minW="full" px={12} mt={6} gap={2}>
          <Button
            onClick={() => setQuery(`&page=${data?.data?.nextPage}`)}
            colorScheme="gray"
          >
            Next Page
          </Button>
          <Button
            onClick={() => setQuery(`&page=${data?.data?.previousPage}`)}
            colorScheme="gray"
          >
            Previous Page
          </Button>
          <Text my="auto" ml="auto" pr={6}>
            Page
            {" "}
            {data?.data?.currentPage}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Blogs;
