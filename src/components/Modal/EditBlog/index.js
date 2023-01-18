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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";

const EditModal = ({ data, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const { token } = useAuth();

  const toast = useToast();
  const navigate = useNavigate();

  const [blogCoverPreviewUrl, setBlogCoverPreviewUrl] = useState(`${process.env.REACT_APP_TEST_URL}${data?.data?.cover_picture_url}`);

  const [cover, setCover] = useState(null);

  const [isDraft, setIsDraft] = useState(data?.data?.isDraft);
  const [unarchive, setUnarchive] = useState(false);

  const onCoverChange = (e) => {
    setBlogCoverPreviewUrl(URL.createObjectURL(e.target.files[0]));
    setCover(e.target.files[0]);
  };

  const onSubmit = async ({ title, description }) => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("isDraft", isDraft);
    formData.append("unarchive", unarchive);
    formData.append("image", cover || null);

    const response = await fetch(`${process.env.REACT_APP_TEST_URL}/blog/${data?.data?.id}`, {
      method: "PATCH",
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
      duration: 9000,
      isClosable: true,
    });

    navigate("/");
    onClose();
  };

  const onCancel = async () => {
    setBlogCoverPreviewUrl(null);
    reset();
    onClose();
  };

  return (
    <Modal
      p={16}
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
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
            <FormControl
              isDisabled={data?.data?.deleted_at !== null}
              isInvalid={errors.coverImage}
            >
              <FormErrorMessage textAlign="center" fontSize="lg" mb={2}>
                {errors.coverImage && errors.coverImage.message}
              </FormErrorMessage>
              <HStack w="full" mb={6} justify="center">
                <Input
                  {...register("coverImage", { })}
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
                  px={64}
                  py={16}
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
                    >
                      CLICK TO UPLOAD COVER
                    </Text>
                    {
                      blogCoverPreviewUrl !== null
                      && (
                      <Button
                        leftIcon={<TrashIcon height={16} />}
                        bgColor="transparent"
                        _hover={{ bgColor: "transparent" }}
                        onClick={() => setBlogCoverPreviewUrl(null)}
                        isDisabled={data?.data?.deleted_at !== null}
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
              {
                data?.data?.deleted_at !== null
                && (
                <>
                  <Text ml={2}>
                    Unarchive
                  </Text>
                  <Switch
                    defaultChecked={unarchive}
                    ml={2}
                    my="auto"
                    colorScheme="red"
                    onChange={() => setUnarchive((prevState) => !prevState)}
                  />
                </>
                )
              }
              <Text ml="auto">
                Save as draft
              </Text>
              <Switch
                isDisabled={data?.data?.deleted_at !== null}
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
                {...register("title")}
                variant="outline"
                colorScheme="gray"
                placeholder="Title"
                defaultValue={data?.data?.title}
                isDisabled={data?.data?.deleted_at !== null}
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
                {...register("description")}
                resize="vertical"
                variant="outline"
                colorScheme="gray"
                placeholder="Description"
                defaultValue={data?.data?.description}
                isDisabled={data?.data?.deleted_at !== null}
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
            onClick={onCancel}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
