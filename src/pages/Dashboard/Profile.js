import React, { useState } from "react";
import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  // IconButton,
  InputLeftElement,
  Flex,
  useColorModeValue,
  // useColorMode,
  useToast,
  Image,
  Box,
  // VStack,
  HStack,
  Avatar,
  AvatarBadge,
  Button,
  // Link,
  FormLabel,
  Skeleton,
} from "@chakra-ui/react";
import {
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  UserIcon,
  LockOpenIcon,
} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";

import ProfileEdit from "../../assets/profile-edit.svg";
import ProfileEditDark from "../../assets/profile-edit-dark.svg";

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { token } = useAuth();

  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);

  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);

  const [profile, setProfile] = useState(null);

  const { isLoading, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  const onProfileChange = (e) => {
    setProfilePreviewUrl(URL.createObjectURL(e.target.files[0]));
    setProfile(e.target.files[0]);
  };

  const buttonBgColor = useColorModeValue("#FAFAF9", "#313131");

  const inputDisabledColor = useColorModeValue("brand.base-dark", "brand.base-light");

  const profileSrc = useColorModeValue(ProfileEdit, ProfileEditDark);

  const buttonBg = useColorModeValue("brand.base-dark", "brand.base-light");

  const onSubmit = async (inputData) => {
    const formData = new FormData();

    formData.append("username", inputData.username || data?.data?.username);
    formData.append("email", inputData.email || data?.data?.email);
    formData.append("firstName", inputData.firstName || data?.data?.firstName);
    formData.append("lastName", inputData.lastName || data?.data?.lastName);
    formData.append("password", inputData.password || data?.data?.password);
    formData.append("image", profile || data?.data?.profile_picture_url);

    const response = await fetch(`${process.env.REACT_APP_TEST_URL}/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const updateData = await response.json();

    toast({
      title: updateData.error || !updateData ? "Oops" : "Success",
      description: updateData.message,
      status: updateData.error ? "error" : "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Flex
        pt={12}
        pb={16}
        minW="full"
        boxShadow="inner"
        bgColor={buttonBgColor}
      >
        <FormControl isInvalid={errors.image}>
          <FormErrorMessage textAlign="center" fontSize="xs">
            {errors.image && errors.image.message}
          </FormErrorMessage>
          <HStack justify="center">
            <Input
              {...register("image", {})}
              cursor="pointer"
              id="image"
              type="file"
              multiple={false}
              hidden
              onChange={onProfileChange}
            />
            <Avatar
              height={40}
              width={40}
              mx="auto"
              src={profilePreviewUrl || `${process.env.REACT_APP_TEST_URL}${data?.data?.profile_picture_url}`}
              boxShadow="dark-lg"
            >
              {
                isEditing
              && (
              <AvatarBadge
                as={FormLabel}
                htmlFor="image"
                bg={buttonBg}
                cursor="pointer"
              >
                <Image src={profileSrc} height={8} p={2} />
              </AvatarBadge>
              )
              }
            </Avatar>
          </HStack>
        </FormControl>
      </Flex>
      <Flex
        as="form"
        direction="column"
        minW="full"
        p={6}
        onSubmit={handleSubmit(onSubmit)}
      >
        {
          isEditing
            ? (
              <Flex ml="auto" gap={2}>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  ml="auto"
                  colorScheme="green"
                  leftIcon={<CheckIcon height={16} />}
                >
                  Save
                </Button>
                <Button
                  ml="auto"
                  colorScheme="red"
                  leftIcon={<TrashIcon height={16} />}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </Flex>
            )
            : (
              <Button
                ml="auto"
                colorScheme="blue"
                leftIcon={<PencilIcon height={16} />}
                onClick={() => setIsEditing((prevState) => !prevState)}
              >
                Edit
              </Button>
            )
        }
        <FormControl isInvalid={errors.email} mt={6} mb={4}>
          <FormErrorMessage fontSize="xs" mb={2}>
            {errors.email && errors.email.message}
          </FormErrorMessage>
          <Skeleton isLoaded={!isLoading}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                p={1}
                rounded="base"
                children={<EnvelopeIcon color={inputDisabledColor} height={16} />}
              />
              <Input
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                isDisabled={!isEditing}
                variant="filled"
                defaultValue={data?.data?.email}
                _disabled={{ color: inputDisabledColor, cursor: "not-allowed" }}
                type="email"
              />
            </InputGroup>
          </Skeleton>
        </FormControl>

        <FormControl isInvalid={errors.firstName || errors.lastName}>
          <FormErrorMessage fontSize="xs" mb={2}>
            {(errors.firstName || errors.lastName) && "This is required"}
          </FormErrorMessage>
          <Box display="flex" gap={2} mb={4}>
            <InputGroup>
              <Skeleton w="full" isLoaded={!isLoading}>
                <Input
                  {...register("firstName", {
                  })}
                  isInvalid={errors.firstName}
                  variant="filled"
                  defaultValue={data?.data?.first_name}
                  isDisabled={!isEditing}
                  _disabled={{ color: inputDisabledColor, cursor: "not-allowed" }}
                />
              </Skeleton>
            </InputGroup>

            <InputGroup>
              <Skeleton w="full" isLoaded={!isLoading}>
                <Input
                  {...register("lastName", {
                  })}
                  isInvalid={errors.lastName}
                  variant="filled"
                  defaultValue={data?.data?.last_name}
                  isDisabled={!isEditing}
                  _disabled={{ color: inputDisabledColor, cursor: "not-allowed" }}
                />
              </Skeleton>
            </InputGroup>
          </Box>
        </FormControl>

        <FormControl isInvalid={errors.username} mb={4}>
          <FormErrorMessage fontSize="xs" mb={2}>
            {errors.username && errors.username.message}
          </FormErrorMessage>
          <Skeleton isLoaded={!isLoading}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                p={1}
                rounded="base"
                children={<UserIcon color={inputDisabledColor} height={16} />}
              />
              <Input
                {...register("username", {
                })}
                variant="filled"
                isDisabled={!isEditing}
                defaultValue={data?.data?.username}
                _disabled={{ color: inputDisabledColor, cursor: "not-allowed" }}
              />
            </InputGroup>
          </Skeleton>
        </FormControl>

        <FormControl isInvalid={errors.password} mb={4}>
          <FormErrorMessage fontSize="xs" mb={2}>
            {errors.password && errors.password.message}
          </FormErrorMessage>
          <Skeleton isLoaded={!isLoading}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                p={1}
                rounded="base"
                children={<LockOpenIcon color={inputDisabledColor} height={16} />}
              />
              <Input
                {...register("password", {
                })}
                type="password"
                variant="filled"
                isDisabled={!isEditing}
                defaultValue={data?.data?.password}
                _disabled={{ color: inputDisabledColor, cursor: "not-allowed" }}
              />
            </InputGroup>
          </Skeleton>
        </FormControl>
      </Flex>
    </>
  );
};

export default Profile;
