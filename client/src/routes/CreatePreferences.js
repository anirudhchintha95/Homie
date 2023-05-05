import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import useAuth from "../useAuth";
import { ImagesAccordianForm } from "../components/Account";
import CreatePreferencesAccordionForm from "../components/CreatePeferencesAccordion";

const CreatePreferences = () => {
  const auth = useAuth();
  const headerRef = React.useRef();
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
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, p: 2 }}>
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
      <Button
        variant="contained"
        component={Link}
        to="/home"
        sx={{ mt: 2 }}
        color="secondary"
        fullWidth
        disabled={auth.user.preferences?._id ? false : true}
      >
        Done
      </Button>
    </Box>
  );
};

export default CreatePreferences;
