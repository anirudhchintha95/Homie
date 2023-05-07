import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import useAuth from "../useAuth";
import { ImagesAccordianForm } from "../components/Account";
import CreatePreferencesAccordionForm from "../components/CreatePeferencesAccordion";
import { ACCOUNT_PANELS } from "../contants";
import useToast from "../useToast";

const CreatePreferences = () => {
  const auth = useAuth();
  const toast = useToast();
  const headerRef = React.useRef();
  const [expanded, setExpanded] = React.useState();
  const [loading, setLoading] = useState();

  const handleChange = (panel) => (_, isExpanded) => {
    if (loading) return;

    if (panel !== ACCOUNT_PANELS.images && auth?.user?.images?.length === 0) {
      toast.showToast("Please add profile image first", { variant: "error" });
      return;
    }

    setExpanded(isExpanded ? panel : null);
  };

  const scrollToTop = () => {
    headerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, p: 2, textAlign: "center" }}>
      <Typography variant="h1" gutterBottom color="primary">
        Bio and Preferences
      </Typography>
      <Typography variant="body1" marginBottom={2}>
        Please add bio, profile image and preferences to get started with your
        "homie" search
      </Typography>
      <ImagesAccordianForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
        scrollToTop={scrollToTop}
      />
      <CreatePreferencesAccordionForm
        expanded={expanded}
        handleChange={handleChange}
        loading={loading}
        setLoading={setLoading}
        scrollToTop={scrollToTop}
      />
    </Box>
  );
};

export default CreatePreferences;
