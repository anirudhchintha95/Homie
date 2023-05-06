import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { validatePassword } from "../../helpers";
import { updatePasswordApi } from "../../api/users";
import { ACCOUNT_PANELS } from "../../contants";
import useAuth from "../../useAuth";

import SubmitButton from "../SubmitButton";

const PasswordAccordionForm = ({
  expanded,
  handleChange,
  loading,
  setLoading,
  scrollToTop,
  setSuccessMsg
}) => {
  const auth = useAuth();
  const [currentPassword, setCurrentPassword] = useState({
    error: false,
    value: "",
  });
  const [newPassword, setNewPassword] = useState({
    error: false,
    value: "",
  });
  const [confirmNewPassword, setConfirmNewPassword] = useState({
    error: false,
    value: "",
  });
  const [passwordFormError, setPasswordFormError] = useState();

  const validatePasswordForm = () => {
    setPasswordFormError();
    const errorFields = [];

    const currentPasswordValidator = validatePassword(
      currentPassword.value,
      "Current password"
    );

    if (currentPasswordValidator.isValid) {
      setCurrentPassword({
        ...currentPassword,
        error: "",
      });
    } else {
      setCurrentPassword({
        ...currentPassword,
        error: currentPasswordValidator.error,
      });
      errorFields.push("currentPassword");
    }

    const newPasswordValidator = validatePassword(
      newPassword.value,
      "New password"
    );

    if (newPasswordValidator.isValid) {
      setNewPassword({
        ...newPassword,
        error: "",
      });
    } else {
      setNewPassword({
        ...newPassword,
        error: newPasswordValidator.error,
      });
      errorFields.push("newPassword");
    }

    const confirmNewPasswordValidator = validatePassword(
      confirmNewPassword.value,
      "Confirm new password"
    );

    if (confirmNewPasswordValidator.isValid) {
      setConfirmNewPassword({
        ...confirmNewPassword,
        error: "",
      });
    } else {
      setConfirmNewPassword({
        ...confirmNewPassword,
        error: confirmNewPasswordValidator.error,
      });
      errorFields.push("confirmNewPassword");
    }

    if (newPassword.value !== confirmNewPassword.value && !errorFields.length) {
      setConfirmNewPassword({
        ...confirmNewPassword,
        error: "Passwords do not match",
      });
      errorFields.push("confirmNewPassword");
    }

    return !errorFields.length;
  };

  const handlePasswordFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const isFormValid = validatePasswordForm();

      if (!isFormValid) {
        scrollToTop();
        setPasswordFormError("Please address the errors in the form.");
        return;
      }

      setLoading(true);

      await updatePasswordApi({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      });

      await auth.refreshCurrentUser();
      setSuccessMsg("Password updated successfully.");
    } catch (error) {
      setPasswordFormError(
        error?.response?.data?.error ||
          error?.message ||
          "Could not update your password. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Accordion
      expanded={expanded === ACCOUNT_PANELS.authentication}
      onChange={handleChange(ACCOUNT_PANELS.authentication)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="password1bh-content"
        id="password1bh-header"
      >
        <Typography
          sx={{
            width: expanded === ACCOUNT_PANELS.authentication ? "100%" : "33%",
            textAlign:
              expanded === ACCOUNT_PANELS.authentication ? "center" : "inherit",
            flexShrink: 0,
            transition: "width 0.5s ease-in-out",
          }}
        >
          Authentication
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            display:
              expanded === ACCOUNT_PANELS.authentication ? "none" : "block",
          }}
        >
          Passwords
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          component="form"
          onSubmit={handlePasswordFormSubmit}
          sx={{ borderColor: "primary" }}
        >
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {passwordFormError ? (
              <Grid item xs={12}>
                <Alert severity="error">{passwordFormError}</Alert>
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12}>
              <TextField
                type="password"
                label="Current Password"
                value={currentPassword.value}
                onChange={(e) => {
                  const value = e.target.value;
                  setCurrentPassword({
                    error: false,
                    value,
                  });
                }}
                onBlur={() => {
                  setCurrentPassword({
                    error: false,
                    value: currentPassword.value?.trim() || "",
                  });
                }}
                error={currentPassword.error}
                helperText={currentPassword.error}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="password"
                label="New Password"
                value={newPassword.value}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewPassword({
                    error: false,
                    value,
                  });
                }}
                onBlur={() => {
                  setNewPassword({
                    error: false,
                    value: newPassword.value?.trim() || "",
                  });
                }}
                error={newPassword.error}
                helperText={newPassword.error}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="password"
                label="Confirm New Password"
                value={confirmNewPassword.value}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmNewPassword({
                    error: false,
                    value,
                  });
                }}
                onBlur={() => {
                  setConfirmNewPassword({
                    error: false,
                    value: confirmNewPassword.value?.trim(),
                  });
                }}
                error={confirmNewPassword.error}
                helperText={confirmNewPassword.error}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <SubmitButton sx={{ marginTop: 2 }} loading={loading} fullWidth>
                Change Password
              </SubmitButton>
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default PasswordAccordionForm;
