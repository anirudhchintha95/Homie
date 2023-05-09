import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { SubmitButton } from "../components";
import {
  AccountAccordianForm,
  BioAccordianForm,
  DeleteUserConfirmationDialog,
  ImagesAccordianForm,
  PasswordAccordionForm,
} from "../components/Account";

const Account = () => {
  const headerRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState();
  const [loading, setLoading] = useState();

  const handleChange = (panel) => (_, isExpanded) => {
    if (loading) return;

    setExpanded(isExpanded ? panel : null);
  };

  const scrollToTop = () => {
    headerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, p: 2 }} ref={headerRef}>
      <Typography variant="h1" align="center" mb={4} color="primary">
        Account
      </Typography>

      <DeleteUserConfirmationDialog
        open={open}
        setOpen={setOpen}
        loading={loading}
        setLoading={setLoading}
      />

      <AccountAccordianForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
        scrollToTop={scrollToTop}
      />
      <BioAccordianForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
      />
      <PasswordAccordionForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
        scrollToTop={scrollToTop}
      />
      <ImagesAccordianForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
        scrollToTop={scrollToTop}
      />
      <Stack direction="row" gap={2}>
        <Button
          variant="contained"
          component={Link}
          to="/home"
          sx={{ mt: 2 }}
          color="secondary"
          fullWidth
          disabled={loading}
        >
          Home
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/homies"
          sx={{ mt: 2 }}
          color="secondary"
          fullWidth
          disabled={loading}
        >
          Find Homies
        </Button>
      </Stack>
      <SubmitButton
        sx={{ marginTop: 2 }}
        loading={loading}
        fullWidth
        color="error"
        onClick={() => setOpen(true)}
      >
        Delete Account
      </SubmitButton>
    </Box>
  );
};

export default Account;
