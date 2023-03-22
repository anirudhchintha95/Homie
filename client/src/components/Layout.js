import React from "react";
import Container from "@mui/material/Container";

import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
