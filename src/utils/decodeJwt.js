import jwtDecode from "jwt-decode";

const decodeJwt = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export default decodeJwt;
