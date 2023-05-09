import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const HomieSkeletonCard = ({ variant = "large" }) => {
  const isLarge = variant === "large";

  return (
    <Card elevation={4} sx={{ position: "relative" }}>
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
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h3-esque"
            maxWidth={{ xs: "90%", sm: 400 }}
            color="primary.main"
            textAlign="center"
          >
            Be patient. You will see your homies here soon...
          </Typography>
        </Box>
      ) : (
        <></>
      )}

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
