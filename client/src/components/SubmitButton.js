import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";

const SubmitButton = ({ children, loading, ...rest }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        {...rest}
      >
        {children}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Box>
  );
};

export default SubmitButton;
