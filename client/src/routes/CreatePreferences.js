import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import useAuth from "../useAuth";
import { ImagesAccordianForm } from "../components/Account";
import CreatePreferencesAccordionForm from "../components/CreatePeferencesAccordion";
import { Toast } from "../components";
import { useNavigate } from "react-router-dom";

const CreatePreferences = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const headerRef = React.useRef();
  const [expanded, setExpanded] = React.useState();
  const [toastError, setToastError] = React.useState();
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

  const fetchUser = async () => {
    try {
      setLoading(true);
      auth.refreshCurrentUser();
      if (!auth.user.preferences?._id) {
        throw new Error("Preferences not created");
      } else {
        navigate("/");
      }
    } catch (error) {
      setToastError(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, p: 2 }}>
      <Toast
        open={!!toastError}
        handleClose={() => setToastError()}
        message={toastError}
        variant="error"
      />
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
        onClick={fetchUser}
        sx={{ mt: 2 }}
        color="secondary"
        fullWidth
        disabled={loading}
      >
        Done
      </Button>
    </Box>
  );
};

export default CreatePreferences;
