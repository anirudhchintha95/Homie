import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

const MessageForm = ({ value, onInputChange, onSubmit, disabled }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
  };
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Send a message"
        inputProps={{ "aria-label": "Send Message" }}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={disabled}
      />
      <IconButton
        color="primary"
        sx={{ p: "10px" }}
        aria-label="Send Message"
        type="submit"
        disabled={disabled}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default MessageForm;
