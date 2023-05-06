import React from "react";
import Container from "@mui/material/Container";

import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
// import CopyrightIcon from "@mui/icons-material/Copyright";

const Layout = () => {
  return (
    <Box bgcolor="background.paper">
      <Navbar />
      <Container maxWidth="md">
        <Outlet />
      </Container>
      {/* <Box
        sx={{
          position: "fixed",
          right: 2,
          bottom: 2,
        }}
      >
        <Box style={{ display: "flex" }}>
          <CopyrightIcon />
          <Typography marginLeft={1}>All rights are reserved</Typography>
        </Box>
      </Box> */}
    </Box>
  );
};

export default React.memo(Layout);
