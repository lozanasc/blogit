import React, { useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  // Image,
  Text,
  Spinner,
  useColorModeValue,
  Button,
  Avatar,
  useToast,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import useFetch from "../hooks/useFetch";
import useAuth from "../hooks/useAuth";
import EditModal from "../components/Modal/EditBlog";

const ViewBlog = () => {
  const { id } = useParams();

  const { isAuthenticated, token, user } = useAuth();

  const toast = useToast();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteWarnOpen,
    onOpen: onDeleteWarnOpen,
    onClose: onDeleteWarnClose,
  } = useDisclosure();

  const cancelRef = useRef();

  const navigate = useNavigate();

  const buttonBgColor = useColorModeValue("#FAFAF9", "#313131");

  const { isLoading, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/blog/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const onBlogArchive = async () => {
    const response = await Axios(`${process.env.REACT_APP_TEST_URL}/blog/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = response.data;

    toast({
      title: resData.error || !resData ? "Oops" : "Success",
      description: resData.message,
      status: resData.error ? "error" : "success",
      duration: 9000,
      isClosable: true,
    });

    navigate("/");
  };

  if (isLoading) {
    return <Spinner m="auto" size="lg" />;
  }

  return (
    <>
      <AlertDialog
        isOpen={isDeleteWarnOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteWarnClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              bgColor={buttonBgColor}
            >
              Archive Blog
            </AlertDialogHeader>

            <AlertDialogBody bgColor={buttonBgColor}>
              Are you sure? You can still unarchive this later on...
            </AlertDialogBody>

            <AlertDialogFooter bgColor={buttonBgColor}>
              <Button ref={cancelRef} onClick={onDeleteWarnClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onBlogArchive} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <EditModal
        data={data}
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
      />
      { data?.data?.deleted_at !== null && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>
            Blog:
            {" "}
            {data?.data?.id}
          </AlertTitle>
          <AlertDescription>
            This blog has been archived last:
            {" "}
            {new Date(data?.data?.deleted_at).toDateString()}
          </AlertDescription>
        </Alert>
      )}
      <>
        <Flex
          pt={12}
          pb={12}
          px={16}
          minW="full"
          boxShadow="inner"
          bgColor={buttonBgColor}
        >
          <Box
            w="full"
            height={40}
            backgroundImage={
              `linear-gradient(
                rgba(0, 0, 0, 0.4),
                rgba(0, 0, 0, 0.4)
              ),
              url(${process.env.REACT_APP_TEST_URL}${data?.data?.cover_picture_url})`
            }
            backgroundPosition="center"
            backgroundSize="cover"
            boxShadow="dark-lg"
            display="flex"
            p={6}
          >
            <Heading
              color="white"
              textAlign="center"
              fontSize="xl"
              m="auto"
            >
              {data?.data?.title}
            </Heading>
          </Box>
        </Flex>
        <Flex
          direction="column"
          minW="full"
          p={6}
        >
          <Flex
            w="full"
            px={12}
            gap={6}
            direction="column"
          >
            <Flex
              w="full"
            >
              <Text>
                {new Date(data?.data?.created_at).toDateString()}
              </Text>
              {
                (isAuthenticated && data?.data?.userId === user)
                && (
                <Flex ml="auto" gap={2}>
                  <Button
                    colorScheme="blue"
                    leftIcon={<PencilSquareIcon height={16} />}
                    onClick={() => onEditModalOpen()}
                  >
                    Edit
                  </Button>
                  <Button
                    isDisabled={data?.data?.deleted_at !== null}
                    colorScheme="red"
                    leftIcon={<TrashIcon height={16} />}
                    onClick={() => onDeleteWarnOpen()}
                  >
                    Archive
                  </Button>
                </Flex>
                )
              }
            </Flex>
            <Flex>
              <Avatar src={`${process.env.REACT_APP_TEST_URL}${data?.data?.author_profile}`} />
              <Text
                ml={4}
                my="auto"
                fontWeight="bold"
              >
                {data?.data?.author}
              </Text>
            </Flex>
            <Text
              whiteSpace="pre-wrap"
              textAlign="justify"
            >
              {data?.data?.description}
            </Text>
          </Flex>
        </Flex>
      </>
    </>
  );
};

export default ViewBlog;
