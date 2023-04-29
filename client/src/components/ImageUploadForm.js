import { Alert, Box, Grid, TextField } from "@mui/material";
import React from "react";
import SubmitButton from "./SubmitButton";
import DisplayImage from "./DisplayImage";

const ImageUploadForm = ({
  error,
  images,
  onImageChange,
  onSubmit,
  loading,
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ borderColor: "primary" }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {error ? (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        ) : (
          <></>
        )}

        {images?.length > 0 ? (
          <Grid item xs={12}>
            <DisplayImage image={images[0]} height="300" />
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="file"
            onChange={(e) => onImageChange(e.target.files[0])}
            inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
          />
        </Grid>

        <Grid item xs={12}>
          <SubmitButton sx={{ marginTop: 2 }} loading={loading} fullWidth>
            {images?.length ? "Update" : "Upload"} Image
          </SubmitButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageUploadForm;
