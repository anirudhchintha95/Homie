import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { SubmitButton, Toast } from "../components";
import {
  AccountAccordianForm,
  DeleteUserConfirmationDialog,
  ImagesAccordianForm,
  PasswordAccordionForm,
} from "../components/Account";

const Account = () => {
  const headerRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState();
  const [loading, setLoading] = useState();
  const [successMsg, setSuccessMsg] = useState();

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
      <Typography variant="h4" align="center" mb={4} color="primary">
        Account
      </Typography>

      <DeleteUserConfirmationDialog
        open={open}
        setOpen={setOpen}
        loading={loading}
        setLoading={setLoading}
      />

      <Toast
        open={!!successMsg}
        handleClose={() => setSuccessMsg()}
        message={successMsg}
        variant="success"
      />

      <AccountAccordianForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
        scrollToTop={scrollToTop}
        setSuccessMsg={setSuccessMsg}
      />
      <PasswordAccordionForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
        scrollToTop={scrollToTop}
        setSuccessMsg={setSuccessMsg}
      />
      <ImagesAccordianForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
        scrollToTop={scrollToTop}
        setSuccessMsg={setSuccessMsg}
      />
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
