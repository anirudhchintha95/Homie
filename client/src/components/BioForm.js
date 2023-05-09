import { React, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import SubmitButton from "./SubmitButton";
import { Alert } from "@mui/material";
import useAuth from "../useAuth";
import { updateBioApi } from "../api/users";

const BioForm = ({ loading, setLoading, onBioUpdate }) => {
  const auth = useAuth();
  const [error, setError] = useState();
  const [bio, setBio] = useState({
    error: false,
    value: auth.user?.bio || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio.value) {
      setBio((prev) => ({ ...prev, error: true }));
      setError("Error: Bio cannot be empty");
      return;
    }

    if (bio.value.length > 250) {
      setBio((prev) => ({ ...prev, error: true }));
      setError("Error: Bio cannot be more than 250 characters");
      return;
    }

    setError("");

    try {
      setLoading(true);
      await updateBioApi({ bio: bio.value.trim().slice(0, 250) });
      await onBioUpdate();
      setLoading(false);
    } catch {
      setLoading(false);
      setError("Error: Bio update failed");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ borderColor: "primary.main" }}
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          {error ? <Alert severity="error">{error}</Alert> : <></>}
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Bio"
            placeholder="Enter you Bio here!!"
            minRows={5}
            value={bio.value}
            multiline
            onChange={(e) =>
              setBio({
                value: e.target.value.slice(0, 250),
                error: false,
              })
            }
            onBlur={(e) =>
              setBio({
                value: e.target.value.trim(),
                error: false,
              })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
            {bio.value?.length}/250
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <SubmitButton sx={{ marginTop: 2 }} loading={loading} fullWidth>
            {auth.user?.bio ? "Update" : "Add"} Bio
          </SubmitButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BioForm;
