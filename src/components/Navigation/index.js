import React, { useState } from "react";
import {
  Image,
  Flex,
  Text,
  useColorModeValue,
  HStack,
  Link,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  useColorMode,
  useBreakpointValue,
  useDisclosure,
  Spinner,
  Button,
} from "@chakra-ui/react";
import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import AuthMenu from "../Menu";

import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import LogoCenteredDark from "../../assets/logo-centered-dark.svg";
import LogoCenteredLight from "../../assets/logo-centered-light.svg";
import SearchModal from "../Modal/Search";
import NewModal from "../Modal/NewBlog";

const Navigation = () => {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const { toggleColorMode } = useColorMode();

  const {
    isOpen: isSearchModalOpen,
    onOpen: onSearchModalOpen,
    onClose: onSearchModalClose,
  } = useDisclosure();

  const {
    isOpen: isNewBlogModalOpen,
    onOpen: onNewBlogModalOpen,
    onClose: onNewBlogModalClose,
  } = useDisclosure();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const logoSrc = useColorModeValue(LogoCenteredLight, LogoCenteredDark);

  const searchIconColor = useColorModeValue("brand.base-dark", "brand.base-light");

  const showModalAfterQuery = useDebounce((query) => {
    if (query.length !== 0) {
      onSearchModalOpen();
      setIsSearching(false);
    }
    setSearchQuery(query);
    setIsSearching(false);
  }, 500);

  const newBlogButton = useBreakpointValue({
    sm: <IconButton
      p={1}
      colorScheme="gray"
      icon={<PlusIcon />}
      onClick={() => onNewBlogModalOpen()}
      size="xs"
    />,
    base: <IconButton
      p={1}
      colorScheme="gray"
      icon={<PlusIcon />}
      onClick={() => onNewBlogModalOpen()}
      size="xs"
    />,
    md: (
      <Button
        onClick={() => onNewBlogModalOpen()}
        colorScheme="gray"
        fontSize={["xs", "xs", "sm"]}
      >
        Create new Blog
      </Button>),
  });

  const ToggleIcon = useColorModeValue(MoonIcon, SunIcon);

  return (
    <>
      <NewModal
        isOpen={isNewBlogModalOpen}
        onClose={onNewBlogModalClose}
      />
      <SearchModal
        query={searchQuery}
        isOpen={isSearchModalOpen}
        onClose={onSearchModalClose}
      />
      <Flex
        minW="100%"
        py={6}
        px={[4, 4, 8]}
      >
        <HStack minW="25%">
          <IconButton
            as={RouterLink}
            to="/"
            mr={2}
            p={1}
            colorScheme="gray"
            icon={<HomeIcon />}
            size="xs"
          />
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              p={1}
              rounded="base"
              children={<MagnifyingGlassIcon color={searchIconColor} height={16} />}
            />
            <Input
              borderBottom="2px"
              borderStart="none"
              borderTop="none"
              borderEnd="none"
              variant="outline"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsSearching(true);
                  showModalAfterQuery(e.target.value);
                }
              }}
            />
            { isSearching && (
            <Spinner
              size={["xs", "xs", "md"]}
              m="auto"
              ml={2}
            />
            ) }
          </InputGroup>
        </HStack>
        <Image
          minW="50%"
          src={logoSrc}
          height={[12, 12, 16]}
          cursor="pointer"
          onClick={() => navigate("/")}
        />
        <HStack
          minW="25%"
          justify="flex-end"
          gap={[1, 1, 6]}
        >
          {
            isAuthenticated
              ? (
                <>
                  {newBlogButton}
                  <AuthMenu />
                </>
              )
              : (
                <Link
                  mr={1}
                  fontSize={["xs", "xs", "md"]}
                  fontWeight="bold"
                  as={RouterLink}
                  to="/login"
                >
                  <Text as="u">
                    Login
                  </Text>
                </Link>
              )
          }
          <IconButton
            p={1}
            colorScheme="gray"
            icon={<ToggleIcon />}
            onClick={toggleColorMode}
            size="xs"
          />
        </HStack>
      </Flex>
    </>
  );
};

export default Navigation;
