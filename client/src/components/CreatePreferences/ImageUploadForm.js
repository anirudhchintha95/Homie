import { Box } from "@mui/material";
import React, { useState } from "react";

import { updateImageApi } from "../../api/users";
import useAuth from "../../useAuth";
import useToast from "../../useToast";

import ImageUploadForm from "../ImageUploadForm";

const CreatePreferencesImageUploadForm = ({
  loading,
  setLoading,
  onImageUpload,
}) => {
  const auth = useAuth();
  const toast = useToast();
  const [image, setImage] = useState();
  const [imageFormError, setImageFormError] = useState();

  const handleImageUpload = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        setImageFormError("Please select a form.");
        return;
      }

      setLoading(true);
      await updateImageApi(auth.user._id, image);
      toast.showToast("Image updated successfully.");
      await onImageUpload();
      setLoading(false);
    } catch (error) {
      setImageFormError(
        error?.response?.data?.error ||
          error?.message ||
          "Could not update your password. Please try again later."
      );
      setLoading(false);
    }
  };
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 2, pt: 6 }}>
      <ImageUploadForm
        error={imageFormError}
        images={auth.user?.images}
        imageValue={image}
        onImageChange={setImage}
        onSubmit={handleImageUpload}
        loading={loading}
        buttonContinuationText="And Continue"
      />
    </Box>
  );
};

export default CreatePreferencesImageUploadForm;
