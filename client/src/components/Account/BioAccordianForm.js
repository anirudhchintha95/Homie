import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ACCOUNT_PANELS } from "../../contants";

import BioForm from "../BioForm";
import useAuth from "../../useAuth";

const BioAccordianForm = ({ expanded, handleChange, loading, setLoading }) => {
  const auth = useAuth();

  return (
    <Accordion
      expanded={expanded === ACCOUNT_PANELS.bio}
      onChange={handleChange(ACCOUNT_PANELS.bio)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="biobh-content"
        id="biobh-header"
      >
        <Typography
          sx={{
            width: expanded === ACCOUNT_PANELS.bio ? "100%" : "33%",
            textAlign: expanded === ACCOUNT_PANELS.bio ? "center" : "inherit",
            flexShrink: 0,
            transition: "width 0.5s ease-in-out",
          }}
        >
          Biography
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            display: expanded === ACCOUNT_PANELS.bio ? "none" : "block",
          }}
        >
          A short description about yourself
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <BioForm
          loading={loading}
          setLoading={setLoading}
          onBioUpdate={async () => {
            await auth.refreshCurrentUser();
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default BioAccordianForm;
