import React, { useState } from "react";
import {
  Flex,
  Spinner,
  Button,
  Text,
  Heading,
} from "@chakra-ui/react";
import BlogCard from "../../../components/Card/Blog";

import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";

const Archived = () => {
  const [query, setQuery] = useState("");

  const { token } = useAuth();

  const { isLoading, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/blogs/user?filter=archived&limit=3${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  if (data?.data?.total === 0) {
    return (
      <Heading align="center">
        Start writing 📝
      </Heading>
    );
  }

  return (
    <>
      <Flex
        w="full"
        display="flex"
        flexDir={["column", "column", "row"]}
        gap={6}
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
      </Flex>
      <Flex mt={6} gap={2}>
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
    </>
  );
};

export default Archived;
