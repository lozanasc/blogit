import React from "react";

import Featured from "../components/Sections/Featured";
import Carousel from "../components/Sections/Carousel";
import MyArticles from "../components/Sections/Blogs";
import useAuth from "../hooks/useAuth";

const Homepage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Carousel />
      {isAuthenticated && <MyArticles />}
      <Featured />
    </>
  );
};

export default Homepage;
