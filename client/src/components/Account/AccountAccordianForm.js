import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ACCOUNT_PANELS } from "../../contants";
import { updateAccountApi } from "../../api/users";
import useAuth from "../../useAuth";

import DatePicker from "../DatePicker";
import SubmitButton from "../SubmitButton";
import { validateDOB } from "../../helpers";

const AccountAccordianForm = ({
  expanded,
  handleChange,
  loading,
  setLoading,
  scrollToTop,
}) => {
  const auth = useAuth();
  const [accountFormError, setAccountFormError] = useState();
  const [firstName, setFirstName] = useState({
    error: false,
    value: auth?.user?.firstName,
  });
  const [lastName, setLastName] = useState({
    error: false,
    value: auth?.user?.lastName,
  });

  const [dob, setDob] = useState({
    error: false,
    value: auth?.user?.dob,
  });
  const [phoneNumber, setPhoneNumber] = useState({
    error: false,
    value: auth?.user?.phone,
  });
  const [gender, setGender] = useState({
    error: false,
    value: auth?.user?.gender,
  });

  const validateForm = () => {
    const errorFields = [];
    if (!firstName.value) {
      errorFields.push("firstName");
      setFirstName((prev) => ({ ...prev, error: "First Name is required" }));
    }

    if (!lastName.value) {
      errorFields.push("lastName");
      setLastName((prev) => ({ ...prev, error: "Last Name is required" }));
    }

    const dobValidator = validateDOB(dob.value, "Date of Birth");

    if (dobValidator.isValid) {
      setDob((prev) => ({ ...prev, error: "" }));
    } else {
      errorFields.push("dob");
      setDob((prev) => ({ ...prev, error: dobValidator.error }));
    }

    if (!phoneNumber.value) {
      errorFields.push("phoneNumber");
      setPhoneNumber((prev) => ({
        ...prev,
        error: "Phone Number is required",
      }));
    }

    if (!gender.value) {
      errorFields.push("gender");
      setGender((prev) => ({ ...prev, error: "Gender is require" }));
    }

    return !errorFields.length;
  };

  const handleAccountFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const isFormValid = validateForm();

      if (!isFormValid) {
        scrollToTop();
        return;
      }

      setLoading(true);

      await updateAccountApi(
        firstName.value,
        lastName.value,
        dob.value,
        phoneNumber.value,
        gender.value
      );

      await auth.getCurrentUser();
    } catch (error) {
      setAccountFormError(
        error?.response?.data?.error ||
          error?.message ||
          "Could not update your details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Accordion
      expanded={expanded === ACCOUNT_PANELS.settings}
      onChange={handleChange(ACCOUNT_PANELS.settings)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="settingsbh-content"
        id="settingsbh-header"
      >
        <Typography
          sx={{
            width: expanded === ACCOUNT_PANELS.settings ? "100%" : "33%",
            textAlign:
              expanded === ACCOUNT_PANELS.settings ? "center" : "inherit",
            flexShrink: 0,
            transition: "width 0.5s ease-in-out",
          }}
        >
          General settings
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            display: expanded === ACCOUNT_PANELS.settings ? "none" : "block",
          }}
        >
          Name, DOB, Phone and Gender
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          component="form"
          onSubmit={handleAccountFormSubmit}
          sx={{ p: 2, borderColor: "primary" }}
        >
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              {accountFormError ? (
                <Alert severity="error">{accountFormError}</Alert>
              ) : (
                <></>
              )}
            </Grid>
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
                helperText={firstName.error}
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
                value={auth?.user?.email}
                disabled
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
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 13)
                  )
                }
                error={dob.error}
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
                    value: phoneNumber.value?.trim(),
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
                Update
              </SubmitButton>
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccountAccordianForm;
