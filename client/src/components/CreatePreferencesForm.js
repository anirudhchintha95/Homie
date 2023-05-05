import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Alert,
  Grid,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { SubmitButton } from "../components";
import CityStatePicker from "./CityStatePicker";
import RentSlider from "./RentSlider";
import AgeSlider from "./AgeSlider";
import { createPreferencesApi } from "../api/preferences";

export default function CreatePreferencesForm({ onCreatePreferences }) {
  const headerRef = React.useRef();

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [city, setCity] = useState({
    error: false,
    value: "",
  });
  const [state, setState] = useState({
    error: false,
    value: "",
  });

  const [smoking, setSmoking] = useState({
    error: false,
    value: "",
  });

  const [drinking, setDrinking] = useState({
    error: false,
    value: "",
  });

  const [pets, setPets] = useState({
    error: false,
    value: "",
  });

  const [rentMin, setRentMin] = useState({
    error: false,
    value: "",
  });

  const [rentMax, setRentMax] = useState({
    error: false,
    value: "",
  });

  const [ageMin, setAgeMin] = useState({
    error: false,
    value: "",
  });

  const [ageMax, setAgeMax] = useState({
    error: false,
    value: "",
  });

  const [gender, setGender] = useState({
    error: false,
    value: [],
  });

  const hasRent = React.useMemo(() => {
    return (
      typeof rentMin.value === "number" && typeof rentMax.value === "number"
    );
  }, [rentMin, rentMax]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setGender({
      error: false,
      value: typeof value === "string" ? value.split(",") : value,
    });
  };

  const validateForm = () => {
    setError("");

    if (!state.value) {
      setState((prev) => ({ ...prev, error: true }));
      setError("Error: State is required");
      return;
    }

    if (!city.value) {
      setError("");
      setCity((prev) => ({ ...prev, error: true }));
      setError("Error: City is required");
      return;
    }

    if (city.value) {
      if (!/^[a-zA-Z\s]*$/.test(city.value)) {
        setError("");
        setCity((prev) => ({ ...prev, error: true }));
        setError("Error: City should contain only alphabets");
        return;
      }
    }

    if (
      smoking.value !== "" &&
      smoking.value !== true &&
      smoking.value !== false
    ) {
      setSmoking((prev) => ({ ...prev, error: true }));
      setError("Error: Smoking should be either true or false or None");
      return;
    }

    if (
      drinking.value !== "" &&
      drinking.value !== true &&
      drinking.value !== false
    ) {
      setDrinking((prev) => ({ ...prev, error: true }));
      setError("Error: Drinking should be either true or false or None");
      return;
    }

    if (pets.value !== "" && pets.value !== true && pets.value !== false) {
      setPets((prev) => ({ ...prev, error: true }));
      setError("Error: Pets should be either true or false or None");
      return;
    }

    if (
      (rentMin.value !== undefined && rentMax.value === undefined) ||
      (rentMin.value === undefined && rentMax.value !== undefined)
    ) {
      if (rentMin.value === undefined) {
        setRentMin((prev) => ({
          ...prev,
          error: true,
        }));
      }
      if (rentMax.value === undefined) {
        setRentMax((prev) => ({
          ...prev,
          error: true,
        }));
      }
      setError("Error: Both Minimum and Maximum Rent should be specified");
      return;
    }

    if ((ageMin.value && !ageMax.value) || (!ageMin.value && ageMax.value)) {
      if (!ageMin.value) {
        setAgeMin((prev) => ({
          ...prev,
          error: "Error: Both Minimum and Maximum Age should be specified",
        }));
        return;
      }
      if (!ageMax.value) {
        setAgeMax((prev) => ({
          ...prev,
          error: "Error: Both Minimum and Maximum Age should be specified",
        }));
        return;
      }
    }

    const gendersArr = ["Male", "Female", "Non-Binary"];
    if (!gender.value.every((elem) => gendersArr.includes(elem))) {
      setGender((prev) => ({ ...prev, error: true }));
      setError(
        "Error: Each element in gender must be either Male, Female or Non-Binary."
      );
      return;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isFormValid = validateForm();

      if (!isFormValid) {
        headerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      setLoading(true);

      let createPreferences = {};
      if (typeof smoking.value === "boolean") {
        createPreferences.smoking = smoking.value;
      }

      if (typeof drinking.value === "boolean") {
        createPreferences.drinking = drinking.value;
      }

      if (typeof pets.value === "boolean") {
        createPreferences.pets = pets.value;
      }

      if (city.value) {
        createPreferences.city = city.value;
      }

      if (state.value) {
        createPreferences.state = state.value;
      }

      if (typeof rentMin.value === "number") {
        createPreferences.rentMin = parseInt(rentMin.value);
      }

      if (typeof rentMax.value === "number") {
        createPreferences.rentMax = parseInt(rentMax.value);
      }

      if (typeof ageMin.value === "number") {
        createPreferences.ageMin = parseInt(ageMin.value);
      }

      if (typeof ageMax.value === "number") {
        createPreferences.ageMax = parseInt(ageMax.value);
      }

      if (gender.value) {
        createPreferences.genders = gender.value;
      }

      if (Object.keys(createPreferences).length > 0) {
        await createPreferencesApi(createPreferences);
        onCreatePreferences();
      }
    } catch (error) {
      setError(
        error?.response?.data?.error ||
          error?.message ||
          "Could not create User. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }} ref={headerRef}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, borderColor: "primary" }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            {error ? <Alert severity="error">{error}</Alert> : <></>}
          </Grid>

          <CityStatePicker
            city={city}
            state={state}
            onCityChange={setCity}
            onStateChange={setState}
          />

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Smoking</InputLabel>
              <Select
                value={smoking.value}
                label="Smoking"
                onChange={(e) =>
                  setSmoking({
                    error: false,
                    value: e.target.value,
                  })
                }
                error={smoking.error}
              >
                <MenuItem value="">--None--</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Drinking</InputLabel>
              <Select
                value={drinking.value}
                label="Drinking"
                onChange={(e) =>
                  setDrinking({
                    error: false,
                    value: e.target.value,
                  })
                }
                error={!!drinking.error}
              >
                <MenuItem value="">--None--</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Pets</InputLabel>
              <Select
                value={pets.value}
                label="Pets"
                onChange={(e) =>
                  setPets({
                    error: false,
                    value: e.target.value,
                  })
                }
                error={!!pets.error}
              >
                <MenuItem value="">--None--</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Rent Range</Typography>
              <Switch
                checked={hasRent}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRentMin({
                      error: false,
                      value: 0,
                    });
                    setRentMax({
                      error: false,
                      value: 500,
                    });
                  } else {
                    setRentMin({
                      error: false,
                      value: undefined,
                    });
                    setRentMax({
                      error: false,
                      value: undefined,
                    });
                  }
                }}
              />
              <Typography>
                {hasRent
                  ? `Min: $${rentMin?.value}, Max: $${rentMax?.value}`
                  : "--None--"}
              </Typography>
            </Stack>
            {hasRent ? (
              <RentSlider
                minRent={rentMin}
                maxRent={rentMax}
                onMaxRentChange={setRentMax}
                onMinRentChange={setRentMin}
              />
            ) : (
              <> </>
            )}
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Age Range</Typography>
              <Switch
                checked={!!(ageMin?.value && ageMax?.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAgeMin({
                      error: false,
                      value: 18,
                    });
                    setAgeMax({
                      error: false,
                      value: 24,
                    });
                  } else {
                    setAgeMin({
                      error: false,
                      value: "",
                    });
                    setAgeMax({
                      error: false,
                      value: "",
                    });
                  }
                }}
              />
              <Typography>
                {ageMin?.value && ageMax?.value
                  ? `Min: ${ageMin?.value}, Max: ${ageMax?.value}`
                  : "--None--"}
              </Typography>
            </Stack>
            {ageMin?.value && ageMax?.value ? (
              <AgeSlider
                minAge={ageMin}
                maxAge={ageMax}
                onMaxAgeChange={setAgeMax}
                onMinAgeChange={setAgeMin}
              />
            ) : (
              <> </>
            )}
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                multiple
                value={gender.value}
                onChange={handleChange}
                error={gender.error}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Non-Binary"}>Non-Binary</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <SubmitButton sx={{ marginTop: 2 }} loading={loading} fullWidth>
              Create Preferences
            </SubmitButton>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
