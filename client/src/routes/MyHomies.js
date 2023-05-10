import React, { useCallback, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { fetchMyHomiesApi } from "../api/homies";
import {
  CONNECTION_TYPES,
  CONNECTION_TYPES_DISPLAY,
  CONNECTION_TYPES_MAP,
} from "../contants";

import {
  HomieCard,
  HomieSkeletonCard,
  NoHomiesCard,
  PageError,
  SearchInputForm,
} from "../components";

const connectionTypes = Object.values(CONNECTION_TYPES);

const MyHomies = () => {
  const mounted = useRef(false);
  const [myHomies, setMyHomies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();

  const [connectionTypeIdx, setConnectionTypeIdx] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const handleChange = (_e, index) => {
    setConnectionTypeIdx(index);
    setSearch("");
    fetchMyHomies(connectionTypes[index], "");
  };

  const fetchMyHomies = useCallback(async (connectionType, searchText) => {
    try {
      setLoading(true);
      setError();
      const users = await fetchMyHomiesApi({
        connectionType,
        search: searchText,
      });
      setMyHomies(users);
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
    if (!mounted.current) {
      fetchMyHomies(connectionTypes[connectionTypeIdx], search);
    }
  }, [fetchMyHomies, connectionTypeIdx, search]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }} marginTop={2}>
      <Grid container rowSpacing={2}>
        <Grid
          xs={12}
          md={6}
          display="flex"
          sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
        >
          <Tabs value={connectionTypeIdx} onChange={handleChange}>
            {connectionTypes.map((type) => (
              <Tab label={type} key={type} />
            ))}
          </Tabs>
        </Grid>
        <Grid
          xs={12}
          md={6}
          display="flex"
          sx={{ justifyContent: { xs: "center", md: "flex-end" } }}
        >
          <SearchInputForm
            searchText={search}
            setSearchText={setSearch}
            onSubmit={() => {
              fetchMyHomies(connectionTypes[connectionTypeIdx], search);
            }}
          />
        </Grid>
      </Grid>
      <br />
      {loading ? (
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={4} lg={3} key={0}>
            <HomieSkeletonCard variant="small" />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3} key={1}>
            <HomieSkeletonCard variant="small" />
          </Grid>
        </Grid>
      ) : error ? (
        <PageError
          onRefresh={() => {
            fetchMyHomies(connectionTypes[connectionTypeIdx], search);
          }}
        >
          {error}
        </PageError>
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent={myHomies?.length ? "flex-start" : "center"}
        >
          {myHomies?.length ? (
            myHomies.map((user) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={user._id}>
                <HomieCard
                  onActionsClick={() => {
                    fetchMyHomies(connectionTypes[connectionTypeIdx], search);
                  }}
                  user={user}
                  variant="small"
                />
              </Grid>
            ))
          ) : (
            <Grid xs={12} md={8}>
              <NoHomiesCard
                title={`No ${
                  CONNECTION_TYPES_DISPLAY[connectionTypes[connectionTypeIdx]]
                } found.`}
                status={
                  CONNECTION_TYPES_MAP[connectionTypes[connectionTypeIdx]]
                }
              />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default MyHomies;
