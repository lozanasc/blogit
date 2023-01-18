/* eslint-disable no-param-reassign */
import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  IconButton,
  InputLeftElement,
  Flex,
  useColorModeValue,
  useColorMode,
  useToast,
  Image,
  Box,
  VStack,
  HStack,
  Avatar,
  AvatarBadge,
  Button,
  Link,
  FormLabel,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  SunIcon,
  MoonIcon,
  UserIcon,
  EnvelopeIcon,
  LockOpenIcon,
} from "@heroicons/react/24/solid";

import LogoCenteredDark from "../../assets/logo-centered-dark.svg";
import LogoCenteredLight from "../../assets/logo-centered-light.svg";
import ProfileEdit from "../../assets/profile-edit.svg";
import ProfileEditDark from "../../assets/profile-edit-dark.svg";

import SignupBg from "../../assets/signup-bg.png";

const Signup = () => {
  const toast = useToast();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);
  const [profile, setProfile] = useState(null);

  const onProfileChange = (e) => {
    setProfilePreviewUrl(URL.createObjectURL(e.target.files[0]));
    setProfile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("password", data.password);
    formData.append("image", profile);

    let resData;

    try {
      const response = await fetch(`${process.env.REACT_APP_TEST_URL}/signup`, {
        method: "POST",
        body: formData,
      });
      resData = await response.json();
    } catch (error) {
      toast({
        title: "Oops",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (!resData.error) {
      navigate("/login");
    }

    toast({
      title: resData.error || !resData ? "Oops" : "Success",
      description: resData.message,
      status: resData.error ? "error" : "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const { toggleColorMode } = useColorMode();

  const logoSrc = useColorModeValue(LogoCenteredLight, LogoCenteredDark);
  const profileSrc = useColorModeValue(ProfileEdit, ProfileEditDark);

  const buttonBg = useColorModeValue("brand.base-dark", "brand.base-light");

  const buttonColor = useColorModeValue("brand.base-light", "brand.base-dark");

  const focusBorderColor = useColorModeValue("brand.base-dark", "brand.base-light");

  const ToggleIcon = useColorModeValue(MoonIcon, SunIcon);

  return (
    <Flex>
      <Box
        display="flex"
        flexDir="column"
        minH="100vh"
        minW={["100%", "100%", "50%"]}
        p={25}
      >
        <IconButton
          ml="auto"
          p={1}
          colorScheme="gray"
          icon={<ToggleIcon />}
          onClick={toggleColorMode}
          size="xs"
        />
        <VStack gap={8} m="auto" w={["90%", "50%"]}>
          <Image
            cursor="pointer"
            src={logoSrc}
            onClick={() => navigate("/")}
          />
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">

            <FormControl isInvalid={errors.image}>
              <FormErrorMessage textAlign="center" fontSize="xs" mb={2}>
                {errors.image && errors.image.message}
              </FormErrorMessage>
              <HStack mb={6} justify="center">
                <Input
                  {...register("image", {
                    required: "This is required",
                    validate: {
                      lessThan10MB: () => profile?.size < 500000 || "Limited to 5MB",
                      acceptedFormats: () => ["image/jpeg", "image/png", "image/jpg"].includes(
                        profile?.type,
                      ) || "Only JPG/JPEG and PNG are allowed",
                    },
                  })}
                  cursor="pointer"
                  id="image"
                  type="file"
                  multiple={false}
                  hidden
                  onChange={onProfileChange}
                />
                <Avatar
                  size="xl"
                  mx="auto"
                  src={profilePreviewUrl}
                >
                  <AvatarBadge
                    as={FormLabel}
                    htmlFor="image"
                    bg={buttonBg}
                    cursor="pointer"
                  >
                    <Image src={profileSrc} height={8} p={2} />
                  </AvatarBadge>
                </Avatar>
              </HStack>
            </FormControl>

            <FormControl isInvalid={errors.firstName || errors.lastName}>
              <FormErrorMessage fontSize="xs" mb={2}>
                {(errors.firstName || errors.lastName) && "This is required"}
              </FormErrorMessage>
              <Box display="flex" gap={2} mb={4}>
                <InputGroup>
                  <Input
                    {...register("firstName", {
                      required: true,
                    })}
                    isInvalid={errors.firstName}
                    variant="filled"
                    focusBorderColor={focusBorderColor}
                    borderColor="brand.base-dark"
                    border={2}
                    color="brand.base-dark"
                    placeholder="First name"
                    bg="#E6E6E6"
                    _hover={{ bg: "#E6E6E6" }}
                    _focus={{ bg: "#E6E6E6" }}
                    _placeholder={{ fontWeight: "bold", color: "brand.base-dark" }}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    {...register("lastName", {
                      required: true,
                    })}
                    isInvalid={errors.lastName}
                    variant="filled"
                    focusBorderColor={focusBorderColor}
                    borderColor="brand.base-dark"
                    border={2}
                    color="brand.base-dark"
                    placeholder="Last name"
                    bg="#E6E6E6"
                    _hover={{ bg: "#E6E6E6" }}
                    _focus={{ bg: "#E6E6E6" }}
                    _placeholder={{ fontWeight: "bold", color: "brand.base-dark" }}
                  />
                </InputGroup>
              </Box>
            </FormControl>

            <FormControl isInvalid={errors.username} mb={4}>
              <FormErrorMessage fontSize="xs" mb={2}>
                {errors.username && errors.username.message}
              </FormErrorMessage>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  p={1}
                  rounded="base"
                  children={<UserIcon color="#282828" height={16} />}
                />
                <Input
                  {...register("username", {
                    required: "This is required",
                  })}
                  variant="filled"
                  focusBorderColor={focusBorderColor}
                  borderColor="brand.base-dark"
                  border={2}
                  color="brand.base-dark"
                  placeholder="Username"
                  bg="#E6E6E6"
                  _hover={{ bg: "#E6E6E6" }}
                  _focus={{ bg: "#E6E6E6" }}
                  _placeholder={{ fontWeight: "bold", color: "brand.base-dark" }}
                />
              </InputGroup>
            </FormControl>

            <FormControl isInvalid={errors.email} mb={4}>
              <FormErrorMessage fontSize="xs" mb={2}>
                {errors.email && errors.email.message}
              </FormErrorMessage>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  p={1}
                  rounded="base"
                  children={<EnvelopeIcon color="#282828" height={16} />}
                />
                <Input
                  {...register("email", {
                    required: "This is required",
                  })}
                  variant="filled"
                  type="email"
                  focusBorderColor={focusBorderColor}
                  borderColor="brand.base-dark"
                  border={2}
                  color="brand.base-dark"
                  placeholder="Email"
                  bg="#E6E6E6"
                  _hover={{ bg: "#E6E6E6" }}
                  _focus={{ bg: "#E6E6E6" }}
                  _placeholder={{ fontWeight: "bold", color: "brand.base-dark" }}
                />
              </InputGroup>
            </FormControl>

            <FormControl isInvalid={errors.password} mb={4}>
              <FormErrorMessage fontSize="xs" mb={2}>
                {errors.password && errors.password.message}
              </FormErrorMessage>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  p={1}
                  rounded="base"
                  children={<LockOpenIcon color="#282828" height={16} />}
                />
                <Input
                  {...register("password", {
                    required: "This is required",
                  })}
                  type="password"
                  variant="filled"
                  focusBorderColor={focusBorderColor}
                  borderColor="brand.base-dark"
                  border={2}
                  color="brand.base-dark"
                  placeholder="Password"
                  bg="#E6E6E6"
                  _hover={{ bg: "#E6E6E6" }}
                  _focus={{ bg: "#E6E6E6" }}
                  _placeholder={{ fontWeight: "bold", color: "brand.base-dark" }}
                />
              </InputGroup>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword}>
              <FormErrorMessage fontSize="xs" mb={2}>
                {errors.confirmPassword && errors.confirmPassword.message}
              </FormErrorMessage>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  p={1}
                  rounded="base"
                  children={<LockOpenIcon color="#282828" height={16} />}
                />
                <Input
                  {...register("confirmPassword", {
                    required: "This is required",
                    // eslint-disable-next-line consistent-return
                    validate: (val) => {
                      if (watch("password") !== val) {
                        return "Your passwords do no match";
                      }
                    },
                  })}
                  type="password"
                  variant="filled"
                  focusBorderColor={focusBorderColor}
                  borderColor="brand.base-dark"
                  border={2}
                  color="brand.base-dark"
                  placeholder="Confirm Password"
                  bg="#E6E6E6"
                  _hover={{ bg: "#E6E6E6" }}
                  _focus={{ bg: "#E6E6E6" }}
                  _placeholder={{ fontWeight: "bold", color: "brand.base-dark" }}
                />
              </InputGroup>
            </FormControl>

            <VStack mt={28}>
              <Button
                isLoading={isSubmitting}
                type="submit"
                bg={buttonBg}
                color={buttonColor}
                minW="75%"
                fontWeight="extrabold"
                fontFamily="heading"
              >
                Sign Up
              </Button>
              <Link size="xs" as={RouterLink} to="/login">I already have an account.</Link>
            </VStack>
          </form>
        </VStack>
      </Box>
      <Box
        minH="100vh"
        minW="50%"
        bg="white"
        display={["none", "none", "block"]}
        backgroundImage={SignupBg}
        bgPosition="center"
        bgSize="cover"
      />
    </Flex>
  );
};

export default Signup;
