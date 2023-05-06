import React from "react";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import UpdatePreferencesForm from "../components/UpdatePreferencesForm";

const Preferences = () => {
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, p: 2 }}>
      <Typography variant="h1" align="center" mb={4} color="primary">
        Preferences
      </Typography>
      <UpdatePreferencesForm />
      <Button
        variant="contained"
        component={Link}
        to="/home"
        sx={{ mt: 2 }}
        color="secondary"
        fullWidth
      >
        Home
      </Button>
    </Box>
  );
};

export default Preferences;
