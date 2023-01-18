/* eslint-disable no-unused-vars */
import {
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Flex,
  Image,
  Box,
  VStack,
  HStack,
  Button,
  Checkbox,
  Link,
  useColorModeValue,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  SunIcon,
  MoonIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

import useAuth from "../../hooks/useAuth";

import LogoCenteredDark from "../../assets/logo-centered-dark.svg";
import LogoCenteredLight from "../../assets/logo-centered-light.svg";

import LoginBg from "../../assets/login-bg.png";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const toast = useToast();

  const navigate = useNavigate();

  const { onLogin } = useAuth();

  const onSubmit = async (data) => {
    let resData;

    try {
      const response = await fetch(`${process.env.REACT_APP_TEST_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
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
      onLogin({ accessToken: resData?.accessToken });
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

  const focusBorderColor = useColorModeValue("brand.base-dark", "brand.base-light");

  const buttonBg = useColorModeValue("brand.base-dark", "brand.base-light");

  const buttonColor = useColorModeValue("brand.base-light", "brand.base-dark");

  const ToggleIcon = useColorModeValue(MoonIcon, SunIcon);

  return (
    <Flex>
      <Box
        display={["none", "none", "block"]}
        minH="100vh"
        minW="50%"
        bgImage={LoginBg}
        bgPosition="center"
        bgSize="cover"
      />
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
        <VStack gap={32} m="auto">
          <Image
            cursor="pointer"
            src={logoSrc}
            onClick={() => navigate("/")}
          />
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  variant="filled"
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

            <FormControl isInvalid={errors.password}>
              <FormErrorMessage fontSize="xs" mb={2}>
                {errors.password && errors.password.message}
              </FormErrorMessage>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  p={1}
                  rounded="base"
                  children={<LockClosedIcon color="#282828" height={16} />}
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

            <HStack mt={2} justify="space-between">
              <Checkbox size="sm" colorScheme="green">Remember me</Checkbox>
              <Link
                size="xs"
                as={RouterLink}
                to="/"
              >
                Forgot password?
              </Link>
            </HStack>
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
                Login
              </Button>
              <Link size="xs" as={RouterLink} to="/signup">I don&apos;t have an account.</Link>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
