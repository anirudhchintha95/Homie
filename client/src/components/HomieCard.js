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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import BlockIcon from "@mui/icons-material/Block";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { getAvatarName, getFullName } from "../utils";
import { styled } from "@mui/material";
import { NoImage } from "../assets";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
}));

const HomieCard = ({ user, onFavoriteClick }) => {
  const handleFavoriteClick = () => {
    console.log("Favorite Clicked");
    onFavoriteClick(user);
  };

  return (
    <Card elevation={4}>
      <CardHeader
        avatar={
          <StyledAvatar aria-label="username">
            {getAvatarName(user)}
          </StyledAvatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={getFullName(user)}
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        height="350"
        image={user.avatar || NoImage}
        alt="user-images"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {user.description || "Description unavailable"}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title="Favorite">
          <IconButton
            aria-label="add to favorites"
            onClick={handleFavoriteClick}
          >
            <FavoriteBorderIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Block">
          <IconButton aria-label="block">
            <BlockIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default HomieCard;
