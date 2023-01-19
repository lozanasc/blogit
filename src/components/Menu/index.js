/* eslint-disable no-unused-vars */
import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useToast,
  Icon,
} from "@chakra-ui/react";
import {
  UserCircleIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

import Axios from "axios";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";

const AuthMenu = () => {
  const { token, onLogout } = useAuth();

  const navigate = useNavigate();
  const toast = useToast();

  const { isLoading, data } = useFetch(`${process.env.REACT_APP_TEST_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleLogout = async () => {
    const response = await Axios(`${process.env.REACT_APP_TEST_URL}/signout`, {
      method: "GET",
      withCredentials: true,
    });

    const resData = response.data;

    toast({
      title: resData.error || !resData ? "Oops" : "Success",
      description: resData.message,
      status: resData.error ? "error" : "success",
      duration: 9000,
      isClosable: true,
    });

    if (response.status === 200) {
      onLogout();
    }
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        as={Avatar}
        aria-label="Options"
        src={`${process.env.REACT_APP_TEST_URL}${data?.data?.profile_picture_url}`}
        size="sm"
        boxShadow="xl"
      />
      <MenuList>
        <MenuItem
          icon={(
            <Avatar
              src={`${process.env.REACT_APP_TEST_URL}${data?.data?.profile_picture_url}`}
              size="xs"
            />
          )}
          cursor="default"
        >

          Hi,
          {" "}
          {!isLoading && data?.data?.first_name}
        </MenuItem>
        <MenuItem
          icon={<UserCircleIcon height={18} />}
          onClick={() => navigate("/profile")}
        >
          Profile
        </MenuItem>
        <MenuItem
          icon={<HomeIcon height={18} />}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          icon={<ArrowRightOnRectangleIcon height={18} />}
          onClick={() => handleLogout()}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AuthMenu;
