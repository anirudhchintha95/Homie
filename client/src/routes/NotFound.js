import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import LinkOffIcon from "@mui/icons-material/LinkOff";

const NotFound = () => {
  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 2,
        p: 2,
        textAlign: "center",
      }}
    >
      <LinkOffIcon color="warning" sx={{ fontSize: 200 }} />
      <Typography variant="h1" align="center" mb={4} color="warning.main">
        404 - Not Found
      </Typography>
      <Typography
        variant="body1"
        align="center"
        mb={4}
        color="primary.main"
        fontSize={20}
      >
        Don't panic, you are not lost. This page does not exist. Just use the
        links below to navigate out of here.
      </Typography>

      <Stack spacing={2}>
        <Button LinkComponent={Link} to="/home" variant="contained">
          Go to home
        </Button>
        <Button LinkComponent={Link} to="/" variant="contained">
          Don't know where to go? Click here
        </Button>
      </Stack>
    </Box>
  );
};

export default NotFound;
