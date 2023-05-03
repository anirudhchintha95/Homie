import React, { useMemo } from "react";
import { State, City } from "country-state-city";
import { Autocomplete, FormControl, Grid, TextField } from "@mui/material";

const statesMap = State.getStatesOfCountry("US");

const getCities = (stateCode) =>
  stateCode ? City.getCitiesOfState("US", stateCode) : [];

const CityStatePicker = ({ city, state, onCityChange, onStateChange }) => {
  const citiesMap = useMemo(() => getCities(state.value), [state.value]);

  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <Autocomplete
            value={statesMap.find(
              ({ isoCode, name }) =>
                isoCode === state.value || name === state.value
            )}
            onChange={(_, newValue) => {
              onStateChange({ error: "", value: newValue?.isoCode || "" });
            }}
            getOptionLabel={(option) => option.name}
            options={statesMap}
            renderInput={(params) => <TextField {...params} label="State" />}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <Autocomplete
            value={citiesMap.find(({ name }) => name === city.value)}
            onChange={(_, newValue) => {
              onCityChange({ error: "", value: newValue?.name || "" });
            }}
            getOptionLabel={(option) => option?.name}
            options={citiesMap}
            renderInput={(params) => <TextField {...params} label="City" />}
            disabled={!state.value}
          />
        </FormControl>
      </Grid>
    </>
  );
};

export default CityStatePicker;
