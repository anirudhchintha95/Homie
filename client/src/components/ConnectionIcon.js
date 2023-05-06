import styled from "@emotion/styled";
import { Avatar, Tooltip } from "@mui/material";
import React from "react";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import DoneIcon from "@mui/icons-material/Done";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import RemoveIcon from "@mui/icons-material/Remove";

import { CONNECTION_STATUSES } from "../contants";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  border: "2px solid",
}));

const ConnectionIcon = ({ status }) => {
  if (!status) {
    return (
      <Tooltip title="Not Linked">
        <StyledAvatar>
          <LinkOffIcon />
        </StyledAvatar>
      </Tooltip>
    );
  }

  if (status === CONNECTION_STATUSES.FAVORITE) {
    return (
      <Tooltip title="Favorite">
        <StyledAvatar>
          <DoneIcon />
        </StyledAvatar>
      </Tooltip>
    );
  }

  if (status === CONNECTION_STATUSES.BLOCKED) {
    return (
      <Tooltip title="Blocked">
        <StyledAvatar>
          <RemoveDoneIcon />
        </StyledAvatar>
      </Tooltip>
    );
  }

  if (status === CONNECTION_STATUSES.IGNORED) {
    return (
      <Tooltip title="Ignored">
        <StyledAvatar>
          <RemoveIcon />
        </StyledAvatar>
      </Tooltip>
    );
  }

  if (status === CONNECTION_STATUSES.MATCHED) {
    return (
      <Tooltip title="Matched">
        <StyledAvatar>
          <DoneAllIcon />
        </StyledAvatar>
      </Tooltip>
    );
  }

  return null;
};

export default React.memo(ConnectionIcon);
