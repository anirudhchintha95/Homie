import { Avatar, styled } from "@mui/material";
import React from "react";
import { getAvatarName } from "../utils";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
}));

const NameAvatar = ({ user, isLarge = false }) => {
  return (
    <StyledAvatar
      aria-label="username"
      sx={!isLarge ? { width: "30px", height: "30px", fontSize: "1.1rem" } : {}}
    >
      {getAvatarName(user)}
    </StyledAvatar>
  );
};

export default React.memo(NameAvatar);
