import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { updateImageApi } from "../../api/users";
import { ACCOUNT_PANELS } from "../../contants";
import useAuth from "../../useAuth";

import ImageUploadForm from "../ImageUploadForm";

const ImagesAccordianForm = ({
  expanded,
  handleChange,
  loading,
  setLoading,
  scrollToTop,
}) => {
  const auth = useAuth();
  const [image, setImage] = useState();
  const [imageFormError, setImageFormError] = useState();

  const handleImageUpload = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        scrollToTop();
        setImageFormError("Please select a form.");
        return;
      }

      setLoading(true);
      await updateImageApi(auth.user._id, image);

      await auth.getCurrentUser();
    } catch (error) {
      setImageFormError(
        error?.response?.data?.error ||
          error?.message ||
          "Could not update your password. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Accordion
      expanded={expanded === ACCOUNT_PANELS.images}
      onChange={handleChange(ACCOUNT_PANELS.images)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="image1bh-content"
        id="image1bh-header"
      >
        <Typography
          sx={{
            width: expanded === ACCOUNT_PANELS.images ? "100%" : "33%",
            textAlign:
              expanded === ACCOUNT_PANELS.images ? "center" : "inherit",
            flexShrink: 0,
            transition: "width 0.5s ease-in-out",
          }}
        >
          Images
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            display: expanded === ACCOUNT_PANELS.images ? "none" : "block",
          }}
        >
          Display Picture
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ImageUploadForm
          error={imageFormError}
          images={auth.user?.images}
          onImageChange={setImage}
          onSubmit={handleImageUpload}
          loading={loading}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ImagesAccordianForm;
