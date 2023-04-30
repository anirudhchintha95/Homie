import React, { useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import { HomieCard, HomieSkeletonCard, PageError } from "../components";
import { fetchHomiesApi } from "../api/homies";

const FindMyHomies = () => {
  const [homies, setHomies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();

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
        {loading ? (
          <Grid xs={12} md={8}>
            <HomieSkeletonCard />
          </Grid>
        ) : error ? (
          <PageError onRefresh={fetchHomies}>{error}</PageError>
        ) : (
          homies.map((user) => (
            <Grid xs={12} md={8} key={user._id}>
              <HomieCard
                user={{
                  ...user,
                  connection: { ...user.connection, status: null },
                }}
                onActionsClick={fetchHomies}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default FindMyHomies;
