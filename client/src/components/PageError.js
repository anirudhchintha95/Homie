import { Alert, AlertTitle, Backdrop, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import React from "react";

const PageError = ({ children, onRefresh }) => {
  return (
    <Backdrop open sx={{ color: "#fff" }}>
      <Alert
        severity="error"
        action={
          onRefresh ? (
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          ) : (
            <></>
          )
        }
      >
        <AlertTitle>Error</AlertTitle>
        {children}
      </Alert>
    </Backdrop>
  );
};

export default PageError;
