import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { ACCOUNT_PANELS } from "../contants";
import CreatePreferencesForm from "./CreatePreferencesForm";

const CreatePreferencesAccordionForm = ({ expanded, handleChange }) => {
  const [preferencesAdded, setPreferencesAdded] = React.useState(false);
  return (
    <Accordion
      expanded={expanded === ACCOUNT_PANELS.preferences}
      onChange={handleChange(ACCOUNT_PANELS.preferences)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="image1bh-content"
        id="image1bh-header"
      >
        <Typography
          sx={{
            width:
              expanded === ACCOUNT_PANELS.preferences
                ? "calc(100% - 24px)"
                : "33%",
            textAlign:
              expanded === ACCOUNT_PANELS.preferences ? "center" : "inherit",
            flexShrink: 0,
            transition: "width 0.5s ease-in-out",
          }}
        >
          Preferences
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            display: expanded === ACCOUNT_PANELS.preferences ? "none" : "block",
          }}
        >
          Create Preferences
        </Typography>
        {preferencesAdded ? (
          <CheckCircleIcon sx={{ marginLeft: "auto" }} color="success" />
        ) : (
          <ErrorIcon sx={{ marginLeft: "auto" }} color="error" />
        )}
      </AccordionSummary>
      <AccordionDetails>
        <CreatePreferencesForm onCreatePreferences={() => setPreferencesAdded(true)} />
      </AccordionDetails>
    </Accordion>
  );
};

export default CreatePreferencesAccordionForm;
