import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import BlockIcon from "@mui/icons-material/Block";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, styled } from "@mui/material";

import { NoImage } from "../assets";
import { getAvatarName, getFullName } from "../utils";
import { CONNECTION_STATUSES } from "../contants";

import Toast from "./Toast";
import useHomieInteractions from "../useUserInteractions";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
}));

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

  const removeMatchedClick = async () =>
    handleActionClick("removeMatched", onActionsClick);
  // MATCHED to IGNORED

  const reportClick = async () => handleActionClick("block", onActionsClick);
  // <any> to BLOCKED
  // MAKE SURE EVERY CONNECTION BECOMES BLOCKED(After admin intervention if applicable)

  return (
    <Card elevation={4}>
      <Toast
        open={error}
        handleClose={resetError}
        message={error}
        variant="error"
      />
      <CardHeader
        avatar={
          <StyledAvatar
            aria-label="username"
            sx={
              !isLarge
                ? { width: "30px", height: "30px", fontSize: "1.1rem" }
                : {}
            }
          >
            {getAvatarName(user)}
          </StyledAvatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={getFullName(user)}
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
        {!status || status === CONNECTION_STATUSES.IGNORED ? (
          <>
            <Tooltip title="Favorite">
              <IconButton
                aria-label="add to favorites"
                onClick={onFavoriteClick}
              >
                <ThumbUpOffAltIcon color="primary" />
              </IconButton>
            </Tooltip>
            {status !== CONNECTION_STATUSES.IGNORED ? (
              <Tooltip title="Ignore">
                <IconButton
                  aria-label="ignore homie"
                  onClick={removeFavoriteClick}
                >
                  <ThumbDownOffAltIcon color="primary" />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
            <Tooltip title="Block">
              <IconButton aria-label="block" onClick={reportClick}>
                <BlockIcon color="primary" />
              </IconButton>
            </Tooltip>
          </>
        ) : status === CONNECTION_STATUSES.FAVORITE ? (
          <>
            <Tooltip title="Remove from favorites">
              <IconButton
                aria-label="remove from favorites"
                onClick={removeFavoriteClick}
              >
                <ThumbUpAltIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Block">
              <IconButton aria-label="block" onClick={reportClick}>
                <BlockIcon color="primary" />
              </IconButton>
            </Tooltip>
          </>
        ) : status === CONNECTION_STATUSES.MATCHED ? (
          <>
            <Tooltip title="Remove from matched">
              <IconButton
                aria-label="remove from matched"
                onClick={removeMatchedClick}
              >
                <VerifiedIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Block">
              <IconButton aria-label="block" onClick={reportClick}>
                <BlockIcon color="primary" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <></>
        )}
      </CardActions>
    </Card>
  );
};

export default HomieCard;
