import {
  Avatar,
  Box,
  Button,
  CardMedia,
  Divider,
  Fab,
  Paper,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import LiquorIcon from "@mui/icons-material/Liquor";
import PetsIcon from "@mui/icons-material/Pets";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ChatIcon from "@mui/icons-material/Chat";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

import { fetchHomieApi } from "../api/homies";
import { getFullName } from "../utils";

import { Loader, HomieActions, ChatModal, PageError } from "../components";
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
  const [loading, setLoading] = useState(true);
  const [openChatModal, setOpenChatModal] = useState(false);

  const fetchUser = async (userId) => {
    try {
      setLoading(true);
      const data = await fetchHomieApi(userId);
      setUser(data);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Could not fetch user"
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
      user.connection.createdById === user._id &&
      user.connection.status === CONNECTION_STATUSES.FAVORITE
    ) {
      return;
    }

    return user.connection.status;
  }, [user]);

  return loading ? (
    <Loader />
  ) : error ? (
    <PageError onRefresh={fetchUser}>{error}</PageError>
  ) : (
    <Box>
      <ChatModal
        user={user}
        messages={user?.connection?.messages}
        open={openChatModal}
        onClose={() => setOpenChatModal(false)}
        onConnectionUpdate={(connection) => {
          setUser((prevUser) => ({
            ...prevUser,
            connection,
          }));
        }}
      />
      {status === CONNECTION_STATUSES.MATCHED ? (
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
          <ChatIcon color="primary" />
        </Fab>
      ) : (
        <></>
      )}
      <Paper component={Box} marginTop="1rem" marginBottom="1rem">
        <CardMedia
          component="img"
          height="300"
          image={user.images[0]}
          alt="user-images"
        />
      </Paper>

      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Box textAlign="center" marginBottom={2}>
          <Typography variant="h3" color="primary">
            {getFullName(user)}
          </Typography>
          <Typography variant="h6" color="primary.light">
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
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Box display="flex" alignItems="center">
              <Tooltip title="Location">
                <StyledAvatar>
                  <EmailIcon />
                </StyledAvatar>
              </Tooltip>
              <Typography
                variant="h6"
                color="primary"
                marginLeft={1}
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Email:
              </Typography>
              <Typography variant="h6" color="primary" marginLeft={0.5}>
                {user.email || "N/A"}
              </Typography>
            </Box>
            <Divider sx={{ height: 28, m: 1 }} orientation="vertical" />
            <Box display="flex" alignItems="center">
              <Tooltip title="Location">
                <StyledAvatar>
                  <PhoneIcon />
                </StyledAvatar>
              </Tooltip>
              <Typography
                variant="h6"
                color="primary"
                marginLeft={1}
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Phone:
              </Typography>
              <Typography variant="h6" color="primary" marginLeft={0.5}>
                {user.phone || "N/A"}
              </Typography>
            </Box>
          </Box>
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
          {status === CONNECTION_STATUSES.MATCHED && (
            <Button
              variant="outlined"
              startIcon={
                user.myContactsVisible ? <PersonOffIcon /> : <PersonIcon />
              }
              sx={{
                border: "2px solid",
                borderColor: "primary",
                marginTop: 2,
              }}
              // onClick={onClick}
              disabled={loading}
            >
              {user.myContactsVisible
                ? "Hide my contact info"
                : "Show my contact info"}
            </Button>
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
            variant="h6"
            color="primary"
            marginLeft={1}
            sx={{ display: { xs: "none", sm: "inline" } }}
          >
            Location:
          </Typography>
          <Typography variant="h6" color="primary" marginLeft={0.5}>
            {user.location.city}, {user.location.state}
          </Typography>
        </Box>
        <Divider sx={{ width: "100%" }} />
        <Box marginTop={2} marginBottom={2} display="flex" alignItems="center">
          <Tooltip title="Home Offered">
            <StyledAvatar>
              <ApartmentIcon />
            </StyledAvatar>
          </Tooltip>
          <Typography variant="h6" color="primary" marginLeft={1}>
            Home Offered:
          </Typography>
          <Typography variant="h6" color="primary" marginLeft={0.5}>
            {user.homes?.length ? "Yes" : "No"}
          </Typography>
        </Box>
        <Divider sx={{ width: "100%" }} />
        <Typography variant="p" color="primary" marginTop={4} marginBottom={4}>
          {user.description || "No description provided"}
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
              variant="h6"
              color="primary"
              marginLeft={1}
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Smoking:
            </Typography>
            <Typography variant="h6" color="primary" marginLeft={0.5}>
              {user.preferences.smoking ? "Yes" : "No"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Tooltip title="Drinking">
              <StyledAvatar>
                <LiquorIcon />
              </StyledAvatar>
            </Tooltip>
            <Typography
              variant="h6"
              color="primary"
              marginLeft={1}
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Drinking:
            </Typography>
            <Typography variant="h6" color="primary" marginLeft={0.5}>
              {user.preferences.drinking ? "Yes" : "No"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Tooltip title="Pets">
              <StyledAvatar>
                <PetsIcon />
              </StyledAvatar>
            </Tooltip>
            <Typography
              variant="h6"
              color="primary"
              marginLeft={1}
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Pets:
            </Typography>
            <Typography variant="h6" color="primary" marginLeft={0.5}>
              {user.preferences.pets ? "Yes" : "No"}
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
          <Typography variant="h6" color="primary" marginLeft={1}>
            Rent:
          </Typography>
          <Typography variant="h6" color="primary" marginLeft={0.5}>
            {!Object.keys(user.preferences.rent || {}).length ? (
              "N/A"
            ) : user.preferences.rent.exact ? (
              <span>${user.preferences.rent.exact / 100}</span>
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
