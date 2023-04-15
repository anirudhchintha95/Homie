import React, { useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import { HomieCard, Loader } from "../components";
import { fetchHomiesApi } from "../api/homies";

const FindMyHomies = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();

  const fetchUsers = useCallback(async () => {
    try {
      const users = await fetchHomiesApi();
      setUsers([...users, ...users, ...users, ...users, ...users]);
    } catch (error) {
      setError(
        error?.response?.datta?.error ||
          error?.message ||
          "Could not fetch homies"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Box sx={{ width: "100%" }} marginTop={2}>
      {loading ? (
        <Loader />
      ) : error ? (
        <>Show Error Here</>
      ) : (
        <Grid container spacing={2} display="flex" justifyContent="center">
          {users.map((user) => (
            <Grid xs={12} md={8} key={user._id}>
              <HomieCard user={user} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FindMyHomies;
