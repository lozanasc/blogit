import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";

import BlogCard from "../../Card/Blog";

import useFetch from "../../../hooks/useFetch";

const SearchModal = ({ query, isOpen, onClose }) => {
  const { isLoading, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/blogs?q=${query}&limit=3`, { withCredentials: false });

  const modalBg = useColorModeValue("brand.base-dark", "brand.base-light");

  useEffect(() => {
    if (query.length <= 0) {
      onClose();
    }
  }, [query]);

  return (
    <Modal
      p={16}
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      bgColor={modalBg}
      rounded="lg"
    >
      <ModalOverlay />
      <ModalContent
        bgColor={useColorModeValue("brand.base-light", "brand.base-dark")}
        color={useColorModeValue("brand.base-dark", "brand.base-light")}
      >
        <ModalHeader>
          Results for:
          {" "}
          {query}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {
            isLoading
              ? (
                <Flex w="full">
                  <Spinner size="xl" mx="auto" />
                </Flex>
              )
              : (
                <Flex
                  w="full"
                  flexDir={["column", "column", "row"]}
                  justify={data?.data?.total >= 4 && "space-evenly"}
                  gap={2}
                >
                  {
                    data?.data?.total === 0 && <Heading m="auto">No blogs found!</Heading>
                  }
                  {
                   data?.data?.total > 0 && data?.data?.data?.map((blog) => (
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
              )

          }
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
