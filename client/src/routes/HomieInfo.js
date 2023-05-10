import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Fab,
  Paper,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import LiquorIcon from "@mui/icons-material/Liquor";
import PetsIcon from "@mui/icons-material/Pets";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import ApartmentIcon from "@mui/icons-material/Apartment";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

import { fetchHomieApi, toggleContactInfoApi } from "../api/homies";
import { getFullName } from "../utils";

import {
  Loader,
  HomieActions,
  ChatModal,
  PageError,
  DisplayImage,
  ConnectionIcon,
  Toast,
} from "../components";
import { CONNECTION_STATUSES } from "../contants";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  border: "2px solid",
}));

const HomieInfo = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [toastError, setToastError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openChatModal, setOpenChatModal] = useState(false);

  const fetchUser = async (userId) => {
    try {
      setLoading(true);
      const data = await fetchHomieApi(userId);
      setUser(data);
    } catch (err) {
      setError(
        err?.response?.data?.error || err.message || "Could not fetch user"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(id);
  }, [id]);

  const status = useMemo(() => {
    if (!user) return;
    if (!user.connection) return;

    if (
      user.connection.currentUser.status === CONNECTION_STATUSES.FAVORITE &&
      user.connection.otherUser.status === CONNECTION_STATUSES.FAVORITE
    ) {
      return CONNECTION_STATUSES.MATCHED;
    }

    return user.connection?.currentUser?.status;
  }, [user]);

  const showMessageButton = useMemo(() => {
    if (!user) return false;
    if (!user.connection) return false;

    // If either one of them is blocked then false
    if (
      user.connection.currentUser.status === CONNECTION_STATUSES.BLOCKED ||
      user.connection.otherUser.status === CONNECTION_STATUSES.BLOCKED
    ) {
      return false;
    }

    // If either one of them is favorite then true
    return (
      user.connection.currentUser.status === CONNECTION_STATUSES.FAVORITE ||
      user.connection.otherUser.status === CONNECTION_STATUSES.FAVORITE
    );
  }, [user]);

  const handleToggleContactsVisibility = async () => {
    try {
      const data = await toggleContactInfoApi(id);
      setUser((prevUser) => ({
        ...prevUser,
        ...data,
      }));
    } catch (err) {
      setToastError(
        err?.response?.data?.error || err.message || "Could not fetch user"
      );
    }
  };

  const handleConnectionUpdate = useCallback((connection) => {
    setUser((prevUser) => ({
      ...prevUser,
      connection,
    }));
  }, []);

  return loading ? (
    <Loader />
  ) : error ? (
    <PageError onRefresh={() => fetchUser(id)}>{error}</PageError>
  ) : (
    <Box>
      <Toast
        open={!!toastError}
        handleClose={() => setToastError()}
        message={toastError}
        variant="error"
      />
      <ChatModal
        user={user}
        messages={user?.connection?.messages}
        open={openChatModal}
        onClose={() => setOpenChatModal(false)}
        onConnectionUpdate={handleConnectionUpdate}
      />
      {showMessageButton ? (
        <Fab
          sx={{
            position: "fixed",
            bottom: 64,
            right: 16,
          }}
          aria-label="Chat"
          color="secondary"
          onClick={() => setOpenChatModal(true)}
        >
          <Badge
            color="warning"
            variant="dot"
            invisible={!user?.connection?.currentUser?.hasUnreadMessages}
          >
            <ChatIcon color="primary" />
          </Badge>
        </Fab>
      ) : (
        <></>
      )}
      <Paper component={Box} marginTop="1rem" marginBottom="1rem">
        <DisplayImage image={user.images[0]} height="300" />
      </Paper>

      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Box textAlign="center" marginBottom={2}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h1" color="primary" mr={1}>
              {getFullName(user)}
            </Typography>
            <ConnectionIcon status={status} />
          </Box>
          <Typography variant="h2" color="primary">
            {user.gender} | {user.age} YO
          </Typography>
        </Box>
        <Divider sx={{ width: "100%" }} />
        <Box
          marginTop={2}
          marginBottom={2}
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          {user.email && user.phone ? (
            <>
              <Box
                display="flex"
                flexDirection="column"
                sx={{ display: { xs: "flex", sm: "none" } }}
              >
                <Box display="flex" alignItems="center" marginBottom={2}>
                  <Tooltip title="Email">
                    <StyledAvatar>
                      <EmailIcon />
                    </StyledAvatar>
                  </Tooltip>
                  <Typography
                    variant="h3"
                    color="primary"
                    marginLeft={1}
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Email:
                  </Typography>
                  <Typography variant="h3" color="primary" marginLeft={0.5}>
                    {user.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Tooltip title="Phone">
                    <StyledAvatar>
                      <PhoneIcon />
                    </StyledAvatar>
                  </Tooltip>
                  <Typography
                    variant="h3"
                    color="primary"
                    marginLeft={1}
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Phone:
                  </Typography>
                  <Typography variant="h3" color="primary" marginLeft={0.5}>
                    {user.phone}
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                marginBottom={2}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <Box display="flex" alignItems="center">
                  <Tooltip title="Email">
                    <StyledAvatar>
                      <EmailIcon />
                    </StyledAvatar>
                  </Tooltip>
                  <Typography
                    variant="h3"
                    color="primary"
                    marginLeft={1}
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Email:
                  </Typography>
                  <Typography variant="h3" color="primary" marginLeft={0.5}>
                    {user.email || "N/A"}
                  </Typography>
                </Box>
                <Divider sx={{ height: 28, m: 1 }} orientation="vertical" />
                <Box display="flex" alignItems="center">
                  <Tooltip title="Phone">
                    <StyledAvatar>
                      <PhoneIcon />
                    </StyledAvatar>
                  </Tooltip>
                  <Typography
                    variant="h3"
                    color="primary"
                    marginLeft={1}
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Phone:
                  </Typography>
                  <Typography variant="h3" color="primary" marginLeft={0.5}>
                    {user.phone || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <Box display="flex" alignItems="center" marginBottom={2}>
              <Box display="flex" alignItems="center">
                <Tooltip title="Email">
                  <StyledAvatar>
                    <EmailIcon />
                  </StyledAvatar>
                </Tooltip>
                <Typography
                  variant="h3"
                  color="primary"
                  marginLeft={1}
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Email:
                </Typography>
                <Typography variant="h3" color="primary" marginLeft={0.5}>
                  {user.email || "N/A"}
                </Typography>
              </Box>
              <Divider sx={{ height: 28, m: 1 }} orientation="vertical" />
              <Box display="flex" alignItems="center">
                <Tooltip title="Phone">
                  <StyledAvatar>
                    <PhoneIcon />
                  </StyledAvatar>
                </Tooltip>
                <Typography
                  variant="h3"
                  color="primary"
                  marginLeft={1}
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Phone:
                </Typography>
                <Typography variant="h3" color="primary" marginLeft={0.5}>
                  {user.phone || "N/A"}
                </Typography>
              </Box>
            </Box>
          )}
          {!user.phone || !user.email ? (
            <Typography variant="overline">
              *
              {status === CONNECTION_STATUSES.MATCHED
                ? "Please wait for them to show their information."
                : "Contact information will be shown if you are matched with them."}
            </Typography>
          ) : (
            <></>
          )}
          {status === CONNECTION_STATUSES.MATCHED ? (
            <Button
              variant="outlined"
              startIcon={
                user.connection?.currentUser?.showUserData ? (
                  <LockIcon />
                ) : (
                  <LockOpenIcon />
                )
              }
              sx={{
                border: "2px solid",
                borderColor: "primary.main",
                marginTop: 2,
              }}
              onClick={handleToggleContactsVisibility}
              disabled={loading}
            >
              {user.connection?.currentUser?.showUserData
                ? "Hide my contact info"
                : "Show my contact info"}
            </Button>
          ) : (
            <></>
          )}
        </Box>
        <Divider sx={{ width: "100%" }} />
        <HomieActions
          user={user}
          onChange={setUser}
          wrapperStyles={{
            marginTop: 2,
            marginBottom: 2,
          }}
        />
        <Divider sx={{ width: "100%" }} />
        <Box marginTop={2} marginBottom={2} display="flex" alignItems="center">
          <Tooltip title="Location">
            <StyledAvatar>
              <LocationOnIcon />
            </StyledAvatar>
          </Tooltip>
          <Typography
            variant="h3"
            color="primary"
            marginLeft={1}
            sx={{ display: { xs: "none", sm: "inline" } }}
          >
            Location:
          </Typography>
          <Typography variant="h3" color="primary" marginLeft={0.5}>
            {user.location.city}, {user.location.state}
          </Typography>
        </Box>
        {/* <Divider sx={{ width: "100%" }} />
        <Box marginTop={2} marginBottom={2} display="flex" alignItems="center">
          <Tooltip title="Home Offered">
            <StyledAvatar>
              <ApartmentIcon />
            </StyledAvatar>
          </Tooltip>
          <Typography variant="h3" color="primary" marginLeft={1}>
            Home Offered:
          </Typography>
          <Typography variant="h3" color="primary" marginLeft={0.5}>
            {user.homes?.length ? "Yes" : "No"}
          </Typography>
        </Box> */}
        <Divider sx={{ width: "100%" }} />
        <Typography variant="p" color="primary" marginTop={4} marginBottom={4}>
          {user.bio || "Bio not provided"}
        </Typography>
        <Divider sx={{ width: "100%" }} />
        <Box
          marginTop={2}
          marginBottom={2}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          width="100%"
        >
          <Box display="flex" alignItems="center">
            <Tooltip title="Smoking">
              <StyledAvatar>
                <SmokingRoomsIcon />
              </StyledAvatar>
            </Tooltip>
            <Typography
              variant="h3"
              color="primary"
              marginLeft={1}
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Smoking:
            </Typography>
            <Typography variant="h3" color="primary" marginLeft={0.5}>
              {typeof user.preferences.smoking === "boolean"
                ? user.preferences.smoking
                  ? "Yes"
                  : "No"
                : "N/A"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Tooltip title="Drinking">
              <StyledAvatar>
                <LiquorIcon />
              </StyledAvatar>
            </Tooltip>
            <Typography
              variant="h3"
              color="primary"
              marginLeft={1}
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Drinking:
            </Typography>
            <Typography variant="h3" color="primary" marginLeft={0.5}>
              {typeof user.preferences.drinking === "boolean"
                ? user.preferences.drinking
                  ? "Yes"
                  : "No"
                : "N/A"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Tooltip title="Pets">
              <StyledAvatar>
                <PetsIcon />
              </StyledAvatar>
            </Tooltip>
            <Typography
              variant="h3"
              color="primary"
              marginLeft={1}
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Pets:
            </Typography>
            <Typography variant="h3" color="primary" marginLeft={0.5}>
              {typeof user.preferences.pets === "boolean"
                ? user.preferences.pets
                  ? "Yes"
                  : "No"
                : "N/A"}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ width: "100%" }} />
        <Box marginTop={2} marginBottom={2} display="flex" alignItems="center">
          <Tooltip title="Rent">
            <StyledAvatar>
              <AttachMoneyIcon />
            </StyledAvatar>
          </Tooltip>
          <Typography variant="h3" color="primary" marginLeft={1}>
            Rent:
          </Typography>
          <Typography variant="h3" color="primary" marginLeft={0.5}>
            {!Object.keys(user.preferences.rent || {}).length ? (
              "N/A"
            ) : (
              <span>
                ${user.preferences.rent.min / 100} - $
                {user.preferences.rent.max / 100}
              </span>
            )}
          </Typography>
        </Box>
        <Divider sx={{ width: "100%" }} />
      </Box>
    </Box>
  );
};

export default HomieInfo;
