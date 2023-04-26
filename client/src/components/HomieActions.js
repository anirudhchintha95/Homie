import React, { useMemo } from "react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import BlockIcon from "@mui/icons-material/Block";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Button, Tooltip, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import useHomieInteractions from "../useUserInteractions";
import { CONNECTION_STATUSES } from "../contants";
import Toast from "./Toast";

const HomieActions = ({
  variant = "full",
  user,
  onChange,
  wrapperStyles = {},
}) => {
  const {
    error: actionError,
    loading,
    resetError,
    handleActionClick,
  } = useHomieInteractions({
    user,
  });

  const onFavoriteClick = async () =>
    handleActionClick("addFavorite", onChange);
  // null to FAVORITE
  // FAVORITE to MATCHED

  const removeFavoriteClick = async () =>
    handleActionClick("removeFavorite", onChange);
  // FAVORITE to null
  // null to IGNORED

  const removeMatchedClick = async () =>
    handleActionClick("removeMatched", onChange);
  // MATCHED to IGNORED

  const reportClick = async () => handleActionClick("report", onChange);

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

  const actions = [];
  if (!status || status === CONNECTION_STATUSES.IGNORED) {
    actions.push({
      title: "Favorite",
      Icon: ThumbUpOffAltIcon,
      onClick: onFavoriteClick,
    });

    if (status !== CONNECTION_STATUSES.IGNORED) {
      actions.push({
        title: "Ignore",
        Icon: ThumbDownOffAltIcon,
        onClick: removeFavoriteClick,
      });
    }

    actions.push({
      title: "Report",
      Icon: BlockIcon,
      onClick: reportClick,
    });
  } else if (status === CONNECTION_STATUSES.FAVORITE) {
    actions.push({
      title: "Remove Favorite",
      Icon: ThumbUpAltIcon,
      onClick: removeFavoriteClick,
    });
    actions.push({
      title: "Report",
      Icon: BlockIcon,
      onClick: reportClick,
    });
  } else if (status === CONNECTION_STATUSES.MATCHED) {
    actions.push({
      title: "Remove Match",
      Icon: VerifiedIcon,
      onClick: removeMatchedClick,
    });
    actions.push({
      title: "Report",
      Icon: BlockIcon,
      onClick: reportClick,
    });
  }

  if (!actions?.length) {
    return <></>;
  }

  return (
    <>
      <Toast
        open={!!actionError}
        handleClose={resetError}
        message={actionError}
        variant="error"
      />
      <Grid
        container
        spacing={variant === "full" ? 2 : 1}
        sx={{ ...wrapperStyles }}
      >
        {actions.map(({ title, Icon, onClick }) => (
          <Grid key={title}>
            {variant === "full" ? (
              <Button
                variant="outlined"
                startIcon={<Icon color="primary" />}
                sx={{
                  border: "2px solid",
                  borderColor: "primary",
                }}
                onClick={onClick}
                disabled={loading}
              >
                {title}
              </Button>
            ) : (
              <Tooltip title={title}>
                <IconButton
                  aria-label={title}
                  onClick={onClick}
                  disabled={loading}
                >
                  <Icon color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default HomieActions;
