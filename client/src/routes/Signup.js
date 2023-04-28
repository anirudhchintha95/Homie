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

import useAuth from "../useAuth";
import { sigunpApi } from "../api/auth";
import { SubmitButton } from "../components";
import DatePicker from "../components/DatePicker";

const Signup = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
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
  const [confirmPassword, setconfirmPassword] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      }

      if (password.value !== confirmPassword.value) {
        setError("Passwords do not match");
        return;
      }
      if (!firstName.value) {
        setFirstName({
          ...firstName,
          error: true,
        });
        return;
      }
      if (!lastName.value) {
        setLastName({
          ...lastName,
          error: true,
        });
        return;
      }
      if (!email.value) {
        setEmail({
          ...email,
          error: true,
        });
        return;
      }
      if (!password.value) {
        setPassword({
          ...password,
          error: true,
        });
        return;
      }
      if (!confirmPassword.value) {
        setconfirmPassword({
          ...confirmPassword,
          error: true,
        });
        return;
      }

      if (!dob.value) {
        setDob({
          ...dob,
          error: true,
        });
        return;
      }
      if (!phoneNumber.value) {
        setPhoneNumber({
          ...phoneNumber,
          error: true,
        });
        return;
      }

      setLoading(true);

      const res = await sigunpApi(
        firstName.value,
        lastName.value,
        email.value,
        password.value,
        dob.value,
        phoneNumber.value,
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
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, p: 2 }}>
      <Typography variant="h4" align="center" mb={4} color="primary">
        Signup
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : <></>}

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, borderColor: "primary" }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
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
              error={firstName.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
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
              error={lastName.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
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
              error={email.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
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
              error={password.error}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
              type="password"
              label="Confirm Password"
              value={confirmPassword.value}
              onChange={(e) => {
                const value = e.target.value;
                setconfirmPassword({
                  error: false,
                  value,
                });
              }}
              onBlur={() => {
                setconfirmPassword({
                  error: false,
                  value: confirmPassword.value.trim(),
                });
              }}
              error={confirmPassword.error}
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
              // min date is 13 years ago
              maxDate={
                new Date(new Date().setFullYear(new Date().getFullYear() - 13))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              variant="outlined"
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
              error={phoneNumber.error}
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
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Non-Binary"}>Non-Binary</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* add a gender selection field */}

        <SubmitButton sx={{ marginTop: 2 }} loading={loading} fullWidth>
          Create Account
        </SubmitButton>
        <Typography mt={2} textAlign="center">
          Click below to login:
        </Typography>
        <Box textAlign="center">
          <Button
            variant="contained"
            component={Link}
            to="/login"
            sx={{ mt: 2 }}
            color="secondary"
            fullWidth
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;
