import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Alert, Button, Select, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import useAuth from "../useAuth";
import { loginApi, sigunpApi } from "../api/auth";

const genderOptions = [
  { value: "Male", label: "MALE" },
  { value: "Female", label: "FEMALE" },
  { value: "Non-Binary", label: "NON-BINARY" },
];
const Signup = () => {
  const [error, setError] = useState();
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

      const res = await sigunpApi(
        firstName.value,
        lastName.value,
        email.value,
        password.value,
        dob.value,
        phoneNumber.value,
        gender.value
      );
      console.log(res);
      // console.log(
      //   firstName.value,
      //   lastName.value,
      //   email.value,
      //   password.value,
      //   dob.value,
      //   phoneNumber.value,
      //   gender.value
      // );
    } catch (error) {
      setError(
        error?.response?.data?.error ||
          error?.message ||
          "Could not create User. Please try again later."
      );
    }
  };

  return (
    <Box sx={{ flexDirection: "row" }} marginTop={2}>
      {error ? <Alert severity="error">{error}</Alert> : <></>}

      <form onSubmit={handleSubmit}>
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
        />

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
        />

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
        />

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
        />

        <TextField
          variant="outlined"
          type="password"
          label="confirmPassword"
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
              value: password.value.trim(),
            });
          }}
          error={password.error}
        />

        <TextField
          variant="outlined"
          label="Date of Birth"
          value={dob.value}
          onChange={(e) =>
            setDob({
              error: false,
              value: e.target.value.trim(),
            })
          }
          onBlur={() => {
            setDob({
              error: false,
              value: dob.value.trim(),
            });
          }}
          error={dob.error}
          type="date"
          fullWidth
        />

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
        {/* add a gender selection field */}

        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
};

export default Signup;
