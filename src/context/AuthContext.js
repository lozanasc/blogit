import React, {
  useState, useEffect, useMemo, useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import Axios from "axios";

const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  const [user, setUser] = useState(localStorage.getItem("user"));

  const location = useLocation();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef();

  const logoutHandler = async () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setToken("");
    setUser("");
  };

  const loginHandler = async (data) => {
    const decoded = jwtDecode(data?.accessToken);
    localStorage.setItem("isAuthenticated", "1");
    localStorage.setItem("accessToken", data?.accessToken);
    localStorage.setItem("user", decoded?.userId);
    setToken(data?.accessToken);
    setIsAuthenticated(true);
    setUser(decoded?.userId);
  };

  const serverSignout = async () => {
    await fetch(`${process.env.REACT_APP_TEST_URL}/signout`, {
      credentials: "include",
    });
    logoutHandler();
  };

  const authRefresh = async () => {
    const { data } = await Axios.get(`${process.env.REACT_APP_TEST_URL}/refresh`, {
      header: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    loginHandler({ accessToken: data?.accessToken });
    navigate("/");
  };

  // Checks expiration time of the token then log out user, listens to path changes
  useEffect(() => {
    if (isAuthenticated) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        onOpen();
      }
    }
  }, [location]);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isAuthenticated");

    if (storedUserLoggedInInformation === "1") {
      setIsAuthenticated(true);
    }
  }, []);

  const values = useMemo(() => ({
    isAuthenticated,
    token,
    user,
    onLogin: loginHandler,
    onLogout: logoutHandler,
  }), [isAuthenticated, token, user]);

  return (
    <AuthContext.Provider
      value={values}
    >
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Login Expired
            </AlertDialogHeader>
            <AlertDialogBody>
              Please click Relogin to refresh access.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  authRefresh();
                  onClose();
                }}
              >
                Relogin
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  serverSignout();
                  logoutHandler();
                  onClose();
                }}
                ml={3}
              >
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
