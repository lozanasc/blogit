import {
  Box, Container, Skeleton, Spinner, useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import CardCarousel from "../Card/Carousel";
import Empty from "./Empty";

import useFetch from "../../hooks/useFetch";

const Carousel = () => {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef();
  const toast = useToast();

  const { isLoading, error, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/blogs?limit=5&order_by=views&order_direction=desc`);

  useEffect(() => {
    if (error) {
      toast({
        title: "Oops",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!isLoading) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Box m="auto" py={32}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Container
      py={6}
      pb={12}
      as={motion.div}
      minW="full"
      overflow="hidden"
      ref={carouselRef}
    >
      { error && <Empty /> }
      {
        data?.data?.data?.length <= 0
          ? <Empty />
          : (
            <Box
              as={motion.div}
              cursor="grab"
              whileTap={{ cursor: "grabbing" }}
              display="flex"
              gap={4}
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
            >
              {
                data?.data?.data?.map((blogs) => (
                  <Skeleton key={blogs?.id} isLoaded={!isLoading}>
                    <CardCarousel
                      id={blogs?.id}
                      key={blogs?.id}
                      title={blogs?.title}
                      bgSrc={`${process.env.REACT_APP_TEST_URL}${blogs.cover_picture_url}`}
                    />
                  </Skeleton>
                ))
              }
            </Box>
          )
      }
    </Container>
  );
};
export default Carousel;
