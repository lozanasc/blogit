import React from "react";
import { Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ViewBlog from "./pages/ViewBlog";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Dashboard/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import Blogs from "./pages/Blogs";

// eslint-disable-next-line no-unused-vars
const appRoutes = (isAuthenticated = false) => [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/blog/:id",
        element: <ViewBlog />,
      },
      {
        path: "/profile",
        element: isAuthenticated ? <Profile /> : <Navigate to="/" />,
      },
      {
        path: "/dashboard",
        element: isAuthenticated ? <Dashboard /> : <Navigate to="/" />,
      },
    ],
  },
  {
    path: "/login",
    element: !isAuthenticated ? <Login /> : <Navigate to="/" />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default appRoutes;
