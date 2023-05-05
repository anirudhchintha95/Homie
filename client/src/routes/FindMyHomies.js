import React, { useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import {
  HomieCard,
  HomieSkeletonCard,
  PageError,
  UpdatePreferencesModal,
} from "../components";
import { fetchHomiesApi } from "../api/homies";
import { Button, Paper, Typography } from "@mui/material";

const FindMyHomies = () => {
  const [homies, setHomies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();
  const [showPreferencesModal, setShowPreferencesModal] = React.useState(false);

  const fetchHomies = useCallback(async () => {
    try {
      const users = await fetchHomiesApi();
      setHomies(users);
    } catch (error) {
      setError(
        error?.response?.data?.error ||
          error?.message ||
          "Could not fetch homies"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomies();
  }, [fetchHomies]);

  return (
    <Box sx={{ width: "100%" }} marginTop={2} marginBottom={2}>
      <Grid container spacing={2} display="flex" justifyContent="center">
        <Grid xs={12} md={8} key="Update_Preferences">
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Typography color="primary">
              You can update and save your filters directly.
            </Typography>
            <Button
              onClick={() => setShowPreferencesModal(true)}
              variant="contained"
            >
              Update Filters
            </Button>
          </Paper>
          <UpdatePreferencesModal
            open={showPreferencesModal}
            onClose={() => setShowPreferencesModal(false)}
            onPreferencesUpdate={async () => {
              await fetchHomies();
              setShowPreferencesModal(false);
            }}
          />
        </Grid>
        {loading ? (
          <Grid xs={12} md={8}>
            <HomieSkeletonCard />
          </Grid>
        ) : error ? (
          <PageError onRefresh={fetchHomies}>{error}</PageError>
        ) : (
          homies.map((user) => (
            <Grid xs={12} md={8} key={user._id}>
              <HomieCard user={user} onActionsClick={fetchHomies} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default FindMyHomies;
