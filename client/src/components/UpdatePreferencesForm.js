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
import { updatePreferencesApi } from "../api/preferences";

export default function UpdatePreferencesForm() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const headerRef = React.useRef();

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [city, setCity] = useState({
    error: false,
    value:
      typeof auth?.user?.location?.city === "string"
        ? auth?.user?.location?.city
        : "",
  });

  const [state, setState] = useState({
    error: false,
    value:
      typeof auth?.user?.location?.state === "string"
        ? auth?.user?.location?.state
        : "",
  });

  const [smoking, setSmoking] = useState({
    error: false,
    value:
      typeof auth?.user?.preferences?.smoking === "boolean"
        ? auth?.user?.preferences?.smoking
        : "",
  });

  const [drinking, setDrinking] = useState({
    error: false,
    value:
      typeof auth?.user?.preferences?.drinking === "boolean"
        ? auth?.user?.preferences?.drinking
        : "",
  });

  const [pets, setPets] = useState({
    error: false,
    value:
      typeof auth?.user?.preferences?.pets === "boolean"
        ? auth?.user?.preferences?.pets
        : "",
  });

  const [rentMin, setRentMin] = useState({
    error: false,
    value:
      typeof auth?.user?.preferences?.rent?.min === "number"
        ? auth?.user?.preferences?.rent?.min / 100
        : "",
  });

  const [rentMax, setRentMax] = useState({
    error: false,
    value:
      typeof auth?.user?.preferences?.rent?.max === "number"
        ? auth?.user?.preferences?.rent?.max / 100
        : "",
  });

  const [ageMin, setAgeMin] = useState({
    error: false,
    value:
      typeof auth?.user?.preferences?.age?.min === "number"
        ? auth?.user?.preferences?.age?.min
        : "",
  });

  const [ageMax, setAgeMax] = useState({
    error: false,
    value:
      typeof auth?.user?.preferences?.age?.max === "number"
        ? auth?.user?.preferences?.age?.max
        : "",
  });

  const [gender, setGender] = useState({
    error: false,
    value:
      typeof auth?.user?.preferences?.genders === "object"
        ? auth?.user?.preferences?.genders
        : "",
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
      setError("");
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

      const preferenceUpdates = {};

      if (auth.user?.location?.city !== city.value) {
        preferenceUpdates.city = city.value;
      }

      if (auth.user?.location?.state !== state.value) {
        preferenceUpdates.state = state.value;
      }

      if (
        rentMax.value &&
        (auth.user?.preferences?.rent?.max !== parseInt(rentMax.value) * 100 ||
          typeof rentMax.value !== "number")
      ) {
        preferenceUpdates.rentMax = parseInt(rentMax.value) * 100;
      }

      if (
        typeof auth.user?.preferences?.rent?.max === "number" &&
        typeof rentMax.value === "string"
      ) {
        if (rentMax.value === "") {
          preferenceUpdates.rentMax = null;
        }
      }

      if (
        rentMin.value &&
        (auth.user?.preferences?.rent?.min !== parseInt(rentMin.value) * 100 ||
          typeof rentMin.value !== "number")
      ) {
        preferenceUpdates.rentMin = parseInt(rentMin.value) * 100;
      }

      if (
        typeof auth.user?.preferences?.rent?.min === "number" &&
        typeof rentMin.value === "string"
      ) {
        if (rentMin.value === "") {
          preferenceUpdates.rentMin = null;
        }
      }

      if (
        ageMax.value &&
        (auth.user?.preferences?.age?.max !== parseInt(ageMax.value) ||
          typeof ageMax.value !== "number")
      ) {
        preferenceUpdates.ageMax = parseInt(ageMax.value);
      }

      if (
        typeof auth.user?.preferences?.age?.max === "number" &&
        typeof ageMax.value === "string"
      ) {
        if (ageMax.value === "") {
          preferenceUpdates.ageMax = null;
        }
      }

      if (
        ageMin.value &&
        (auth.user?.preferences?.age?.min !== parseInt(ageMin.value) ||
          typeof ageMin.value !== "number")
      ) {
        preferenceUpdates.ageMin = parseInt(ageMin.value);
      }

      if (
        typeof auth.user?.preferences?.age?.min === "number" &&
        typeof ageMin.value === "string"
      ) {
        if (ageMin.value === "") {
          preferenceUpdates.ageMin = null;
        }
      }

      if (
        typeof auth.user?.preferences?.smoking === "undefined" &&
        typeof smoking.value === "boolean"
      ) {
        preferenceUpdates.smoking = smoking.value;
      }

      if (
        typeof auth.user?.preferences?.smoking === "boolean" &&
        typeof smoking.value === "boolean"
      ) {
        if (auth.user?.preferences?.smoking !== smoking.value) {
          preferenceUpdates.smoking = smoking.value;
        }
      }

      if (
        typeof auth.user?.preferences?.smoking === "boolean" &&
        typeof smoking.value === "string"
      ) {
        preferenceUpdates.smoking = null;
      }

      if (
        typeof auth.user?.preferences?.drinking === "undefined" &&
        typeof drinking.value === "boolean"
      ) {
        preferenceUpdates.drinking = drinking.value;
      }

      if (
        typeof auth.user?.preferences?.drinking === "boolean" &&
        typeof drinking.value === "boolean"
      ) {
        if (auth.user?.preferences?.drinking !== drinking.value) {
          preferenceUpdates.drinking = drinking.value;
        }
      }

      if (
        typeof auth.user?.preferences?.drinking === "boolean" &&
        typeof drinking.value === "string"
      ) {
        preferenceUpdates.drinking = null;
      }

      if (
        typeof auth.user?.preferences?.pets === "undefined" &&
        typeof pets.value === "boolean"
      ) {
        preferenceUpdates.pets = pets.value;
      }

      if (
        typeof auth.user?.preferences?.pets === "boolean" &&
        typeof pets.value === "boolean"
      ) {
        if (auth.user?.preferences?.pets !== pets.value) {
          preferenceUpdates.pets = pets.value;
        }
      }

      if (
        typeof auth.user?.preferences?.pets === "boolean" &&
        typeof pets.value === "string"
      ) {
        preferenceUpdates.pets = null;
      }

      // if (
      //   pets.value &&
      //   (auth.user?.preferences?.pets !== pets.value ||
      //     typeof pets.value !== "boolean")
      // ) {
      //   preferenceUpdates.pets = pets.value;
      // }

      // if (
      //   typeof auth.user?.preferences?.pets === "boolean" &&
      //   typeof pets.value === "string"
      // ) {
      //   preferenceUpdates.pets = null;
      // }

      if (
        (gender.value &&
          auth.user?.preferences.genders.toString() !==
            gender.value.toString()) ||
        typeof gender.value !== "object"
      ) {
        preferenceUpdates.genders = gender.value;
      }

      if (Object.keys(preferenceUpdates).length === 0) {
        setError("No changes were made");
      }
      if (Object.keys(preferenceUpdates).length > 0) {
        setError("");
        // console.log(preferenceUpdates);
        await updatePreferencesApi(preferenceUpdates);

        //await auth.refreshCurrentUser();
        // navigate(from || "/", {
        //   replace: true,
        // });
      }
    } catch (error) {
      setError(
        error?.response?.data?.error ||
          error?.message ||
          "Could not update Preferences. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }} ref={headerRef}>
      {/* <Typography variant="h4" align="center" mb={4} color="primary">
      {auth?.user?.preferences? "Update" : "Create"} Preferences
      </Typography> */}

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
              //   onBlur={() => {
              //     setCity({
              //       error: false,
              //       value: city.value.trim(),
              //     });
              //   }}
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
                const value = e.target.value;
                setRentMin({
                  error: false,
                  value,
                });
              }}
              //   onBlur={() => {
              //     setRentMin({
              //       error: false,
              //       value: rentMin?.value.trim(),
              //     });
              //   }}
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
              //   onBlur={() => {
              //     setRentMax({
              //       error: false,
              //       value: rentMax?.value?.trim(),
              //     });
              //   }}
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
                const value = e.target.value;
                setAgeMin({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setAgeMin({
                  error: false,
                  value: ageMin.value.trim(),
                });
              }}
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
              {auth?.user?.preferences ? "Update" : "Create"} Preferences
            </SubmitButton>
          </Grid>
        </Grid>
        {/* add a gender selection field */}

        {/* <SubmitButton sx={{ marginTop: 2 }} loading={loading} fullWidth>
          Create Preferences
        </SubmitButton> */}
      </Paper>
    </Box>
  );
}
