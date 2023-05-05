import React, { useEffect } from "react";
import MessageForm from "./MessageForm";
import {
  Avatar,
  Box,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getFullName } from "../utils";
import { sendMessageApi } from "../api/homies";
import Toast from "./Toast";
import NameAvatar from "./NameAvatar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  border: "2px solid",
  borderColor: "primary.main",
  boxShadow: 24,
  mt: 7,
  mb: 7,
  maxHeight: "75vh",
  overflow: "scroll",
};

const ChatModal = ({ open, onClose, user, messages, onConnectionUpdate }) => {
  const listRef = React.useRef(null);
  const [message, setMessage] = React.useState("");
  const [shouldScrollIntoView, setShouldScrollIntoView] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [toastError, setToastError] = React.useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const connection = await sendMessageApi(user._id, message);
      setMessage("");
      onConnectionUpdate(connection);
    } catch (err) {
      setToastError(
        err?.response?.data?.message || err.message || "Could not send message"
      );
    } finally {
      setLoading(false);
    }
  };

  React.useLayoutEffect(() => {
    if (shouldScrollIntoView) {
      if (listRef.current) {
        listRef.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
        });
      }
      setShouldScrollIntoView(false);
    }
  }, [shouldScrollIntoView]);

  useEffect(() => {
    setShouldScrollIntoView(true);
  }, [open, messages]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Paper
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "background.paper",
            zIndex: 99,
            textAlign: "center",
            p: 1,
            borderRadius: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          elevation={3}
        >
          <NameAvatar user={user} isLarge />
          <Typography variant="h3" color="primary">
            Chat History
          </Typography>
          <Tooltip title="Close">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Paper>
        <Toast
          open={Boolean(toastError)}
          handleClose={() => setToastError(null)}
          message={toastError}
          variant="error"
        />
        <CssBaseline />
        <List ref={listRef}>
          {messages?.length ? (
            messages.map(({ _id, sentByUserId, message }) => (
              <ListItem key={_id}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    sentByUserId === user?._id ? getFullName(user) : "Me"
                  }
                  secondary={message}
                />
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ textAlign: "center" }}>
              <ListItemText primary="Chat not created yet" />
            </ListItem>
          )}
        </List>
        <Paper
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            bg: "background.paper",
          }}
          elevation={3}
        >
          <MessageForm
            value={message}
            onInputChange={setMessage}
            onSubmit={handleSubmit}
            disabled={loading}
          />
        </Paper>
      </Box>
    </Modal>
  );
};

export default ChatModal;
