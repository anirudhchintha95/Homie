import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAuth from "../useAuth";
import { updateImageApi } from "../api/users";
import { ACCOUNT_PANELS } from "../contants";
import ImageUploadForm from "./ImageUploadForm";
import CreatePreferencesForm from "./CreatePreferencesForm";

const CreatePreferencesAccordionForm = ({
  expanded,
  handleChange,
  loading,
  setLoading,
  scrollToTop,
}) => {
  const auth = useAuth();
  // const [image, setImage] = useState();
  // const [imageFormError, setImageFormError] = useState();

  // const handleImageUpload = async (e) => {
  //   e.preventDefault();
  //   try {

  //     setLoading(true);
  //     //await updateImageApi(auth.user._id, image);

  //     await auth.getCurrentUser();
  //   } catch (error) {
  //     setImageFormError(
  //       error?.response?.data?.error ||
  //         error?.message ||
  //         "Could not update your password. Please try again later."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  //};
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
            width: expanded === ACCOUNT_PANELS.preferences ? "100%" : "33%",
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
      </AccordionSummary>
      <AccordionDetails>
        <CreatePreferencesForm />
      </AccordionDetails>
    </Accordion>
  );
};

export default CreatePreferencesAccordionForm;
