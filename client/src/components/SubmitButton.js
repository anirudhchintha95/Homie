import React from "react";
import { Button, CircularProgress } from "@mui/material";

const SubmitButton = ({ children, loading, ...rest }) => {
    return (
        <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            {...rest}
        >
            {loading ? <CircularProgress /> : null} {children}
        </Button>
    );
};

export default SubmitButton;
