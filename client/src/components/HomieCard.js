import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
// import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { NoImage } from "../assets";
import { getFullName } from "../utils";
import { CONNECTION_STATUSES } from "../contants";

import Toast from "./Toast";
import useHomieInteractions from "../useUserInteractions";
import HomieActions from "./HomieActions";
import NameAvatar from "./NameAvatar";

const HomieCard = ({
  user,
  variant = "large",
  onActionsClick,
  status = null,
}) => {
  const isLarge = variant === "large";

  const { error, resetError, handleActionClick } = useHomieInteractions({
    user,
  });

  const onFavoriteClick = async () =>
    handleActionClick("addFavorite", onActionsClick);
  // null to FAVORITE
  // FAVORITE to MATCHED

  const removeFavoriteClick = async () =>
    handleActionClick("removeFavorite", onActionsClick);
  // FAVORITE to null
  // null to IGNORED

  return (
    <Card elevation={4}>
      <Toast
        open={error}
        handleClose={resetError}
        message={error}
        variant="error"
      />
      <CardHeader
        avatar={<NameAvatar user={user} isLarge={isLarge} />}
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={
          <Link component={RouterLink} to={`/homies/${user._id}`}>
            {getFullName(user)}
          </Link>
        }
        subheader={isLarge ? `${user.gender} | ${user.age} YO` : null}
      />
      {isLarge ? (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          position="relative"
        >
          {!status || status === CONNECTION_STATUSES.IGNORED ? (
            <Box
              width="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="absolute"
              left="0"
              backgroundColor="rgb(217, 226, 213, 0.5)"
              height="100%"
              sx={{
                transition: "0.5s",
                "&:hover": { boxShadow: 1 },
              }}
            >
              <ThumbDownOffAltIcon
                sx={{
                  padding: "4px",
                  "&:hover": { animation: "flickerAnimation 1.5s infinite" },
                }}
                cursor="pointer"
                onClick={removeFavoriteClick}
                color="primary"
              />
            </Box>
          ) : (
            <></>
          )}
          <CardMedia
            component="img"
            height={isLarge ? "350" : "100"}
            image={user.images?.length ? user.images[0] : NoImage}
            alt="user-images"
          />
          {!status || status === CONNECTION_STATUSES.IGNORED ? (
            <Box
              width="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="absolute"
              right="0"
              backgroundColor="rgb(217, 226, 213, 0.5)"
              height="100%"
              sx={{
                transition: "0.5s",
                "&:hover": { boxShadow: 1 },
              }}
            >
              <ThumbUpOffAltIcon
                sx={{
                  padding: "4px",
                  "&:hover": { animation: "flickerAnimation 1.5s infinite" },
                }}
                cursor="pointer"
                onClick={onFavoriteClick}
                color="primary"
              />
            </Box>
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <CardMedia
          component="img"
          height="100"
          image={user.images?.length ? user.images[0] : NoImage}
          alt="user-images"
        />
      )}

      {isLarge ? (
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {user.description || "Description unavailable"}
          </Typography>
        </CardContent>
      ) : (
        <></>
      )}
      <CardActions disableSpacing>
        <HomieActions user={user} variant="small" onChange={onActionsClick} />
      </CardActions>
    </Card>
  );
};

export default HomieCard;
