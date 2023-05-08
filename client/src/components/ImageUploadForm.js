import { Alert, Box, Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import SubmitButton from "./SubmitButton";
import DisplayImage from "./DisplayImage";

const ImageUploadForm = ({
  error,
  images,
  imageValue,
  onImageChange,
  onSubmit,
  loading,
  buttonContinuationText,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ borderColor: "primary.main" }}
    >
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
            <DisplayImage image={images[0]} height="300" elevation={2} />
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12}>
          <input
            hidden
            id="contained-button-file"
            type="file"
            onChange={(e) => {
              onImageChange(e.target.files[0]);
            }}
            accept="image/png, image/gif, image/jpeg"
          />
          <Stack
            htmlFor="contained-button-file"
            component="label"
            spacing={2}
            direction="row"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="secondary"
              component="span"
              sx={{ flexShrink: 0 }}
            >
              Choose Image
            </Button>
            <Typography textOverflow="ellipsis" overflow="hidden" component="span">
              {imageValue?.name || "No file uploaded"}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <SubmitButton sx={{ marginTop: 2 }} loading={loading} fullWidth>
            {images?.length ? "Update" : "Upload"} Image
            {buttonContinuationText ? ` ${buttonContinuationText}` : ""}
          </SubmitButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageUploadForm;
