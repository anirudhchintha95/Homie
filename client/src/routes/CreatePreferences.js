import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Alert,
  Button,
  Grid,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useLocation, Link } from "react-router-dom";

import useAuth from "../useAuth";
import { sigunpApi } from "../api/auth";
import { SubmitButton } from "../components";
import DatePicker from "../components/DatePicker";
import { createPreferencesApi } from "../api/users";
import CreatePreferencesForm from "../components/CreatePreferencesForm";
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
