import { React, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import SubmitButton from "./SubmitButton";
import { Alert } from "@mui/material";
import useAuth from "../useAuth";

const BioForm = ({ loading, setLoading, onBioUpdate }) => {
  const auth = useAuth();
  const [error, setError] = useState();
  const [bio, setBio] = useState({
    error: false,
    value: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio.value) {
      setBio((prev) => ({ ...prev, error: true }));
      setError("Bio cannot be empty");
      return;
    }

    try {
      setLoading(true);
      console.log(bio.value);
      //---- API CALL goes HERE -------
      await onBioUpdate();
      //await refreshCurrentUser();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ borderColor: "primary" }}
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          {error ? <Alert severity="error">{error}</Alert> : <></>}
        </Grid>

        <Grid item xs={12}>
          <TextareaAutosize
            aria-label="Bio"
            placeholder="Enter you Bio here!!"
            minRows={3}
            onChange={(e) => setBio({ value: e.target.value, error: false })}
            style={{ width: "100%" }}
          />
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
