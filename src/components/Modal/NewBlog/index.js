import React, { useState } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Image,
  HStack,
  Button,
  useColorModeValue,
  Text,
  Flex,
  Textarea,
  Switch,
  useToast,
  // Spinner,
  // Flex,
  // Heading,
} from "@chakra-ui/react";

import {
  TrashIcon,
  CheckIcon,
  CloudArrowDownIcon,
} from "@heroicons/react/24/solid";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import useAuth from "../../../hooks/useAuth";

const NewModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const { token } = useAuth();

  const toast = useToast();

  const navigate = useNavigate();

  const [blogCoverPreviewUrl, setBlogCoverPreviewUrl] = useState(null);

  const [cover, setCover] = useState(null);

  const [isDraft, setIsDraft] = useState(true);

  const onCoverChange = (e) => {
    setBlogCoverPreviewUrl(URL.createObjectURL(e.target.files[0]));
    setCover(e.target.files[0]);
  };

  const onExit = async () => {
    setBlogCoverPreviewUrl(null);
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("isDraft", isDraft);
    formData.append("image", cover);

    const response = await fetch(`${process.env.REACT_APP_TEST_URL}/blog`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const resData = await response.json();

    toast({
      title: resData.error || !resData ? "Oops" : "Success",
      description: resData.message,
      status: resData.error ? "error" : "success",
      duration: 5000,
      isClosable: true,
    });

    onExit();
    navigate("/");
  };

  return (
    <Modal
      p={16}
      isOpen={isOpen}
      onClose={onClose}
      size={["xs", "lg", "3xl", "6xl"]}
      closeOnOverlayClick={!isSubmitting}
      isCentered={[true, true, false]}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          bgColor={useColorModeValue("brand.base-light", "brand.base-dark")}
          color={useColorModeValue("brand.base-dark", "brand.base-light")}
        >
          New Blog
        </ModalHeader>
        <ModalBody
          p={6}
          bgColor={useColorModeValue("brand.base-light", "brand.base-dark")}
          color={useColorModeValue("brand.base-dark", "brand.base-light")}
        >
          <form
            id="newBlogForm"
            encType="multipart/form-data"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl isInvalid={errors.coverImage}>
              <FormErrorMessage textAlign="center" fontSize="lg" mb={2}>
                {errors.coverImage && errors.coverImage.message}
              </FormErrorMessage>
              <HStack w="full" mb={6} justify="center">
                <Input
                  {...register("coverImage", {
                    required: "This is required",
                    validate: {
                      acceptedFormats: () => ["image/jpeg", "image/png", "image/jpg"].includes(
                        cover?.type,
                      ) || "Only JPG/JPEG and PNG are allowed",
                    },
                  })}
                  id="image"
                  type="file"
                  hidden
                  multiple={false}
                  onChange={onCoverChange}
                />
                <Image
                  as={FormLabel}
                  htmlFor="image"
                  cursor="pointer"
                  display="flex"
                  flexDir="column"
                  w="full"
                  backgroundPosition="center"
                  backgroundSize="cover"
                  css={{
                    border: 2,
                    borderStyle: "dashed",
                  }}
                  backgroundImage={blogCoverPreviewUrl}
                  px={[16, 16, 64]}
                  py={[8, 8, 16]}
                >
                  <Flex
                    direction="column"
                    p={6}
                    bgColor={useColorModeValue("brand.base-light", "brand.base-dark")}
                    rounded="lg"
                  >
                    <CloudArrowDownIcon height={32} />
                    <Text
                      align="center"
                      fontWeight="bold"
                      fontSize={["xs", "xs", "lg"]}
                    >
                      DRAG OR UPLOAD COVER PICTURE
                    </Text>
                    {
                      blogCoverPreviewUrl !== null
                      && (
                      <Button
                        leftIcon={<TrashIcon height={16} />}
                        bgColor="transparent"
                        _hover={{ bgColor: "transparent" }}
                        onClick={() => setBlogCoverPreviewUrl(null)}
                      >
                        Remove
                      </Button>
                      )
                    }
                  </Flex>
                </Image>
              </HStack>
            </FormControl>
            <Flex w="full" py={2}>
              <Text ml="auto">
                Save as draft
              </Text>
              <Switch
                defaultChecked={isDraft}
                ml={2}
                my="auto"
                colorScheme="green"
                onChange={() => setIsDraft((prevState) => !prevState)}
              />
            </Flex>
            <FormControl
              isInvalid={errors.title}
              mb={4}
              w="full"
              pl={2}
            >
              <FormErrorMessage fontSize="lg" mb={2}>
                {errors.title && errors.title.message}
              </FormErrorMessage>
              <Input
                {...register("title", {
                  required: "This is required",
                })}
                variant="outline"
                colorScheme="gray"
                placeholder="Title"
              />
            </FormControl>

            <FormControl
              isInvalid={errors.description}
              mb={4}
              w="full"
              pl={2}
            >
              <FormErrorMessage fontSize="lg" mb={2}>
                {errors.description && errors.description.message}
              </FormErrorMessage>
              <Textarea
                {...register("description", {
                  required: "This is required",
                })}
                resize="vertical"
                variant="outline"
                colorScheme="gray"
                placeholder="Description"
              />
            </FormControl>

          </form>
        </ModalBody>
        <ModalFooter
          gap={2}
          bgColor={useColorModeValue("brand.base-light", "brand.base-dark")}
          color={useColorModeValue("brand.base-dark", "brand.base-light")}
        >
          <Button
            leftIcon={<CheckIcon height={16} />}
            colorScheme="green"
            type="submit"
            form="newBlogForm"
            isLoading={isSubmitting}
          >
            Upload
          </Button>
          <Button
            leftIcon={<TrashIcon height={16} />}
            colorScheme="red"
            onClick={onExit}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewModal;
