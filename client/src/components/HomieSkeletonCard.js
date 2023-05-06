import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Skeleton from "@mui/material/Skeleton";

const HomieSkeletonCard = ({ variant = "large" }) => {
  const isLarge = variant === "large";

  return (
    <Card elevation={4}>
      <CardHeader
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={isLarge ? 40 : 30}
            height={isLarge ? 40 : 30}
          />
        }
        title={
          <Skeleton
            animation="wave"
            variant="text"
            height={isLarge ? 20 : 10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={
          <Skeleton animation="wave" variant="text" height={10} width="40%" />
        }
      />
      <Skeleton
        height={isLarge ? 350 : 100}
        animation="wave"
        variant="rectangular"
      />

      {isLarge ? (
        <CardContent>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </CardContent>
      ) : (
        <></>
      )}
      <CardActions>
        <Skeleton animation="wave" variant="circular" width={25} height={25} />
        <Skeleton animation="wave" variant="circular" width={25} height={25} />
      </CardActions>
    </Card>
  );
};

export default React.memo(HomieSkeletonCard);
