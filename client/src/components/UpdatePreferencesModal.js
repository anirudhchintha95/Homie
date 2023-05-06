import React from "react";
import {
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import UpdatePreferencesForm from "./UpdatePreferencesForm";

const UpdatePreferencesModal = ({ open, onClose, onPreferencesUpdate }) => {
  return (
    <Dialog open={open} onClose={onClose} scroll="paper">
      <DialogTitle
        component="div"
        sx={{
          width: { xs: "90%", sm: 400 },
          textAlign: "center",
          padding: "16px 0",
        }}
      >
        <Typography variant="h3-esque" color="primary" component="h1">
          Update Preferences
        </Typography>
        <Tooltip
          title="Close"
          sx={{ position: "absolute", right: "10px", top: "12px" }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers sx={{ width: { xs: "90%", sm: 400 }, p: 0 }}>
        <UpdatePreferencesForm onPreferencesUpdate={onPreferencesUpdate} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePreferencesModal;
