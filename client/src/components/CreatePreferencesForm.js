import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Alert, Button, Grid, Paper, Select, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useLocation, Link } from "react-router-dom";

import useAuth from "../useAuth";
import { SubmitButton } from "../components";
import { createPreferencesApi } from "../api/preferences";

export default function CreatePreferencesForm() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
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
    // if (
    //   !firstName.value ||
    //   !lastName.value ||
    //   !email.value ||
    //   !password.value ||
    //   !dob.value ||
    //   !phoneNumber.value ||
    //   !gender.value
    // ) {
    //   setError("Please fill in all fields");
    //   return;
    // }

    // if (password.value !== confirmPassword.value) {
    //   setError("Passwords do not match");
    //   return;
    // }
    // if (!firstName.value) {
    //   setFirstName({
    //     ...firstName,
    //     error: true,
    //   });
    //   return;
    // }

    if (!city.value) {
      setCity((prev) => ({ ...prev, error: "City is required" }));
      return;
    }

    if (!state.value) {
      setState((prev) => ({ ...prev, error: true }));
      setError("State is required");
      return;
    }

    // if (!smoking.value) {
    //   setSmoking((prev) => ({ ...prev, error: true }));
    //   setError("Smoking is required");
    //   return;
    // }

    // if (!drinking.value) {
    //   setDrinking((prev) => ({ ...prev, error: true }));
    //   setError("Drinking is required");
    //   return;
    // }

    // if (!pets.value) {
    //   setPets((prev) => ({ ...prev, error: true }));
    //   setError("Pets is required");
    //   return;
    // }

    // if(!drinking.value) {
    //   setDrinking({
    //     ...drinking,
    //     error: true,
    //   });
    //   return;
    // }

    // if(!pets.value) {
    //   setPets({
    //     ...pets,
    //     error: true,
    //   });
    //   return;
    // }

    // if (!rentMin.value) {
    //   setError("");
    //   setRentMin((prev) => ({ ...prev, error: "Minimum Rent is required" }));
    //   return;
    // }

    // if (!rentMax.value) {
    //   setError("");
    //   setRentMax((prev) => ({ ...prev, error: "Maximum Rent is required" }));
    //   return;
    // }

    // if (!ageMin.value) {
    //   setError("");
    //   setAgeMin((prev) => ({ ...prev, error: "Minimum Age is required" }));
    //   return;
    // }

    // if (!ageMax.value) {
    //   setError("");
    //   setAgeMax((prev) => ({ ...prev, error: "Maximum Age is required" }));
    //   return;
    // }

    // if (!state.value || !smoking.value || !drinking.value || !pets.value) {
    //   setError("Please fill in all fields");
    //   return;
    // }

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

      // await auth.signIn(res?.accesstoken, () => {
      //   navigate(from || "/", {
      //     replace: true,
      //   });
      // });

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

      if (
        typeof rentMin.value === "string" &&
        rentMin.value.trim().length > 0
      ) {
        createPreferences.rentMin = rentMin.value;
      }

      if (
        typeof rentMax.value === "string" &&
        rentMax.value.trim().length > 0
      ) {
        createPreferences.rentMax = rentMax.value;
      }

      if (typeof ageMin.value === "string" && ageMin.value.trim().length > 0) {
        createPreferences.ageMin = ageMin.value;
      }

      if (typeof ageMax.value === "string" && ageMax.value.trim().length > 0) {
        createPreferences.ageMax = ageMax.value;
      }

      if (gender.value) {
        createPreferences.genders = gender.value;
      }

      //console.log(!gender[0]);
      // if (Object.keys(createPreferences).length === 0) {
      //   setError("No changes were made");
      // }
      if (Object.keys(createPreferences).length > 0) {
        await createPreferencesApi(createPreferences);
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

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Location-City"
              value={city.value}
              onChange={(e) => {
                const value = e.target.value;
                setCity({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setCity({
                  error: false,
                  value: city.value.trim(),
                });
              }}
              error={!!city.error}
              helperText={city.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={state.value}
                label="State"
                onChange={(e) =>
                  setState({
                    error: false,
                    value: e.target.value,
                  })
                }
                error={!!state.error}
              >
                <MenuItem value={"CA"}>California</MenuItem>
                <MenuItem value={"CT"}>Connecticut</MenuItem>
                <MenuItem value={"PA"}>Pennsylvania</MenuItem>
                <MenuItem value={"RI"}>Rhode Island</MenuItem>
                <MenuItem value={"VT"}>Vermont</MenuItem>
                <MenuItem value={"NH"}>New Hampshire</MenuItem>
                <MenuItem value={"ME"}>Maine</MenuItem>
                <MenuItem value={"NJ"}>New Jersey</MenuItem>
                <MenuItem value={"NY"}>New York</MenuItem>
                <MenuItem value={"MA"}>Massachusetts</MenuItem>
              </Select>
            </FormControl>
          </Grid>

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
            <TextField
              variant="outlined"
              label="Minimum Rent"
              value={rentMin.value}
              onChange={(e) => {
                setRentMin({
                  error: false,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                setRentMin({
                  error: false,
                  value: rentMin.value.trim(),
                });
              }}
              error={!!rentMin.error}
              helperText={rentMin.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Maximum Rent"
              value={rentMax.value}
              onChange={(e) => {
                const value = e.target.value;
                setRentMax({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setRentMax({
                  error: false,
                  value: rentMax.value.trim(),
                });
              }}
              error={!!rentMax.error}
              helperText={rentMax.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Minimum Age"
              value={ageMin.value}
              onChange={(e) => {
                setAgeMin({
                  error: false,
                  value: e.target.value,
                });
              }}
              //   onBlur={() => {
              //     setAgeMin({
              //       error: false,
              //       value: ageMin.value.trim(),
              //     });
              //   }}
              error={!!ageMin.error}
              helperText={ageMin.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Maximum Age"
              value={ageMax.value}
              onChange={(e) => {
                const value = e.target.value;
                setAgeMax({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setAgeMax({
                  error: false,
                  value: ageMax.value.trim(),
                });
              }}
              error={!!ageMax.error}
              helperText={ageMax.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                multiple
                value={gender.value}
                onChange={handleChange}
                input={<OutlinedInput label="Gender" />}
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
