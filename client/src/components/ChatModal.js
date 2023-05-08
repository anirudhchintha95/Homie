import React, { useEffect, useMemo } from "react";
import MessageForm from "./MessageForm";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  Tooltip,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { getFullName } from "../utils";
import { sendMessageApi, markMessagesAsSeenApi } from "../api/homies";
import { CONNECTION_STATUSES } from "../contants";

import Toast from "./Toast";
import NameAvatar from "./NameAvatar";

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

  useEffect(() => {
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

  useEffect(() => {
    const markMessagesAsSeen = async () => {
      try {
        const connection = await markMessagesAsSeenApi(user._id);
        onConnectionUpdate(connection);
      } catch (err) {
        // Not going to throw an error here as it just marks it as seen
        console.log(err);
      }
    };
    if (open && user?.connection?.currentUser?.hasUnreadMessages) {
      markMessagesAsSeen();
    }
  }, [open, user, onConnectionUpdate]);

  const canSendMessage = useMemo(
    () =>
      user?.connection?.currentUser?.status === CONNECTION_STATUSES.FAVORITE,
    [user]
  );

  return (
    <Dialog open={open} onClose={onClose} scroll="paper">
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: { xs: "90%", sm: 400 },
          p: "10px",
        }}
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
      </DialogTitle>
      <Toast
        open={Boolean(toastError)}
        handleClose={() => setToastError(null)}
        message={toastError}
        variant="error"
      />
      <DialogContent dividers sx={{ width: { xs: "90%", sm: 400 }, p: "10px" }}>
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
                  sx={{ overflowWrap: "break-word" }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ textAlign: "center" }}>
              <ListItemText primary="Chat not created yet" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 0,
          width: { xs: "90%", sm: 400 },
          p: "10px",
          justifyContent: "center",
        }}
      >
        {canSendMessage ? (
          <MessageForm
            value={message}
            onInputChange={setMessage}
            onSubmit={handleSubmit}
            disabled={loading}
          />
        ) : (
          <Typography
            variant="body1"
            color="primary"
            sx={{ textDecoration: "underline" }}
          >
            You can only chat or send messages with your favorites
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChatModal;
