import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Alert,
  Button,
  Grid,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  getMinAndMaxDatesForDOB,
  validateDOB,
  validateEmail,
  validateGender,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from "../helpers";
import { GENDERS } from "../contants";

import useAuth from "../useAuth";
import { sigunpApi } from "../api/auth";
import { SubmitButton, DatePicker } from "../components";

const Signup = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const headerRef = React.useRef();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState({
    error: false,
    value: "",
  });
  const [lastName, setLastName] = useState({
    error: false,
    value: "",
  });
  const [email, setEmail] = useState({
    error: false,
    value: "",
  });
  const [password, setPassword] = useState({
    error: false,
    value: "",
  });
  const [confirmPassword, setConfirmPassword] = useState({
    error: false,
    value: "",
  });
  const [dob, setDob] = useState({
    error: false,
    value: "",
  });
  const [phoneNumber, setPhoneNumber] = useState({
    error: false,
    value: "",
  });
  const [gender, setGender] = useState({
    error: false,
    value: "",
  });

  const validateForm = () => {
    // if (!firstName.value) {
    //   setFirstName((prev) => ({ ...prev, error: "First Name is required" }));
    //   return;
    // }
    // if (!lastName.value) {
    //   setLastName((prev) => ({ ...prev, error: "Last Name is required" }));
    //   return;
    // }
    // if (!email.value) {
    //   setEmail((prev) => ({ ...prev, error: "Email is required" }));
    //   return;
    // }
    // if (!password.value) {
    //   setPassword((prev) => ({ ...prev, error: "Password is required" }));
    //   return;
    // }
    // if (!confirmPassword.value) {
    //   setConfirmPassword((prev) => ({
    //     ...prev,
    //     error: "Confirm Password is required",
    //   }));
    //   return;
    // }
    // if (!dob.value) {
    //   setDob((prev) => ({ ...prev, error: true }));
    //   setError("Date of Birth is required");
    //   return;
    // }
    // if (!phoneNumber.value) {
    //   setPhoneNumber((prev) => ({
    //     ...prev,
    //     error: "Phone Number is required",
    //   }));
    //   return;
    // }
    // if (!gender.value) {
    //   setGender((prev) => ({ ...prev, error: "Gender is required" }));
    //   return;
    // }

    if (
      !firstName.value ||
      !lastName.value ||
      !email.value ||
      !password.value ||
      !dob.value ||
      !phoneNumber.value ||
      !gender.value
    ) {
      setError("Please fill in all fields");
      return;
    } else {
      setError("");
    }

    const errorFields = [];
    const firstNameValidator = validateName(
      firstName.value?.trim(),
      "First Name"
    );
    if (!firstNameValidator.isValid) {
      errorFields.push("firstName");
      setFirstName((prev) => ({ ...prev, error: firstNameValidator.error }));
      //return;
    }

    const lastNameValidaor = validateName(lastName.value?.trim(), "Last Name");
    if (!lastNameValidaor.isValid) {
      errorFields.push("lastName");
      setLastName((prev) => ({ ...prev, error: lastNameValidaor.error }));
      //return;
    }

    const emailValidator = validateEmail(email.value?.trim());
    if (!emailValidator.isValid) {
      errorFields.push("email");
      setEmail((prev) => ({ ...prev, error: emailValidator.error }));
      //return;
    }

    const passwordValidator = validatePassword(password.value);
    if (!passwordValidator.isValid) {
      errorFields.push("password");
      setPassword((prev) => ({ ...prev, error: passwordValidator.error }));
      //return;
    }

    if (password.value !== confirmPassword.value) {
      errorFields.push("confirmPassword");
      // setPassword((prev) => ({ ...prev, error: "Passwords do not match" }));
      setConfirmPassword((prev) => ({
        ...prev,
        error: "Passwords do not match",
      }));
      //return;
    }

    const dateValid = validateDOB(dob.value);
    if (!dateValid.isValid) {
      errorFields.push("dob");
      setDob((prev) => ({ ...prev, error: dateValid.error }));
      //return;
    }

    const phoneValidator = validatePhoneNumber(phoneNumber.value?.trim());
    if (!phoneValidator.isValid) {
      errorFields.push("phoneNumber");
      setPhoneNumber((prev) => ({
        ...prev,
        error: phoneValidator.error,
      }));
      //return;
    }

    const genderValidator = validateGender(gender.value);
    if (!genderValidator.isValid) {
      errorFields.push("gender");
      setGender((prev) => ({ ...prev, error: genderValidator.error }));
      //return;
    }
    return !errorFields.length;
    // setError("");
    // return true;
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

      const res = await sigunpApi(
        firstName.value.trim(),
        lastName.value.trim(),
        email.value.trim().toLowerCase(),
        password.value,
        dob.value,
        phoneNumber.value.trim(),
        gender.value
      );

      await auth.signIn(res?.accesstoken, () => {
        navigate(from || "/", {
          replace: true,
        });
      });
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
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, p: 2 }} ref={headerRef}>
      <Typography variant="h1" align="center" mb={4} color="primary">
        Signup
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, borderColor: "primary.main" }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            {error ? <Alert severity="error">{error}</Alert> : <></>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="First Name"
              value={firstName.value}
              onChange={(e) => {
                const value = e.target.value;
                setFirstName({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setFirstName({
                  error: false,
                  value: firstName.value.trim(),
                });
              }}
              error={!!firstName.error}
              helperText={firstName.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Last Name"
              value={lastName.value}
              onChange={(e) => {
                const value = e.target.value;
                setLastName({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setLastName({
                  error: false,
                  value: lastName.value.trim(),
                });
              }}
              error={!!lastName.error}
              helperText={lastName.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              value={email.value}
              onChange={(e) => {
                const value = e.target.value;
                setEmail({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setEmail({
                  error: false,
                  value: email.value.trim(),
                });
              }}
              error={!!email.error}
              helperText={email.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              value={password.value}
              onChange={(e) => {
                const value = e.target.value;
                setPassword({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setPassword({
                  error: false,
                  value: password.value.trim(),
                });
              }}
              error={!!password.error}
              helperText={password.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="password"
              label="Confirm Password"
              value={confirmPassword.value}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmPassword({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setConfirmPassword({
                  error: false,
                  value: confirmPassword.value.trim(),
                });
              }}
              error={!!confirmPassword.error}
              helperText={confirmPassword.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <DatePicker
              label="Date of Birth"
              value={dob.value}
              onChange={(date) =>
                setDob({
                  error: false,
                  value: new Date(date),
                })
              }
              {...getMinAndMaxDatesForDOB()}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              value={phoneNumber.value}
              onChange={(e) =>
                setPhoneNumber({
                  error: false,
                  value: e.target.value.trim(),
                })
              }
              onBlur={() => {
                setPhoneNumber({
                  error: false,
                  value: phoneNumber.value.trim(),
                });
              }}
              error={!!phoneNumber.error}
              helperText={phoneNumber.error}
              type="tel"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender.value}
                label="Gender"
                onChange={(e) =>
                  setGender({
                    error: false,
                    value: e.target.value,
                  })
                }
                error={!!gender.error}
              >
                {Object.values(GENDERS).map((gender) => (
                  <MenuItem value={gender} key={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <SubmitButton loading={loading} fullWidth>
              Create Account
            </SubmitButton>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component={Link}
              to="/login"
              color="secondary"
              fullWidth
              disabled={loading}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Signup;
