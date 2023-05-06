import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { deleteAccountApi } from "../../api/users";
import { validateEmail } from "../../helpers";
import useAuth from "../../useAuth";

import SubmitButton from "../SubmitButton";
import Toast from "../Toast";
import { Box } from "@mui/material";

const DeleteUserConfirmationDialog = ({
  open,
  setOpen,
  loading,
  setLoading,
}) => {
  const auth = useAuth();
  const [email, setEmail] = React.useState({
    error: "",
    value: "",
  });
  const [error, setError] = React.useState();

  const handleClose = () => {
    setOpen(false);
  };

  const onDeleteConfirmation = async (e) => {
    try {
      e.preventDefault();
      const emailValidator = validateEmail(email.value);
      if (!emailValidator.isValid) {
        setEmail({
          error: emailValidator.error,
          value: "",
        });
        return;
      }
      if (email.value !== auth?.user?.email) {
        setEmail({
          error: "Email does not match",
          value: "",
        });
        return;
      }
      setLoading(true);
      await deleteAccountApi(email.value);
      setLoading(false);
      auth.signOut();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Could not delete your account"
      );
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Toast
        open={!!error}
        handleClose={() => setError()}
        variant="error"
        message={error}
      />
      <Box component="form" onSubmit={onDeleteConfirmation}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Are you sure you wan to delete your account? This action cannot be
            undone.
          </DialogContentText>
          <TextField
            type="email"
            label="Confirm Email"
            value={email.value}
            onChange={(e) => {
              const value = e.target.value;
              setEmail({
                error: "",
                value,
              });
            }}
            onBlur={() => {
              setEmail({
                error: "",
                value: email.value?.trim() || "",
              });
            }}
            error={!!email.error}
            helperText={email.error}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <SubmitButton
            onClick={onDeleteConfirmation}
            loading={loading}
            color="error"
          >
            Delete
          </SubmitButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DeleteUserConfirmationDialog;
