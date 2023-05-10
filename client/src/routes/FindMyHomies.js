import React, { useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import {
  HomieCard,
  HomieSkeletonCard,
  NoHomiesCard,
  PageError,
  UpdatePreferencesModal,
} from "../components";
import { fetchHomiesApi } from "../api/homies";
import { Button, Card, CardContent, Typography } from "@mui/material";

const getMatchedPreferences = (user) => {
  const matched = [];

  if (user.smokingScore) {
    matched.push("Smoking");
  }

  if (user.drinkingScore) {
    matched.push("Drinking");
  }

  if (user.petsScore) {
    matched.push("Pets");
  }

  if (user.rentsScore) {
    matched.push("Rent");
  }

  if (user.ageScore) {
    matched.push("Age");
  }

  // if (user.genderScore) {
  //   matched.push("Gender");
  // }

  return matched;
};

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
          <Card elevation={4}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h3-esque" color="primary">
                You can update and save your filters here.
              </Typography>
              <Button
                onClick={() => setShowPreferencesModal(true)}
                variant="contained"
              >
                Update Filters
              </Button>
            </CardContent>
          </Card>
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
        ) : homies?.length ? (
          homies.map((user) => (
            <Grid xs={12} md={8} key={user._id}>
              <HomieCard
                user={user}
                onActionsClick={fetchHomies}
                matchedPreferences={getMatchedPreferences(user)}
              />
            </Grid>
          ))
        ) : (
          <Grid xs={12} md={8}>
            <NoHomiesCard body={"Change your preferences to find homies"} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FindMyHomies;
