import React from "react";
import { Alert, Snackbar } from "@mui/material";

import ToastContext from "../ToastContext";

const ToastProvider = ({ children }) => {
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const showToast = React.useCallback(
    (message, { variant = "success" } = {}) => {
      setSnackPack((prev) => [
        ...prev,
        { message, variant, key: new Date().getTime() },
      ]);
    },
    []
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {messageInfo ? (
          <Alert
            onClose={handleClose}
            severity={messageInfo?.variant}
            sx={{ width: "100%" }}
          >
            {messageInfo.message}
          </Alert>
        ) : undefined}
      </Snackbar>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
