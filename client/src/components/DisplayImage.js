import { CardMedia, Paper } from "@mui/material";
import React from "react";

import { NoImage } from "../assets";

const DisplayImage = ({ image, height = "300", elevation, ...rest }) => {
  return (
    <Paper elevation={elevation || 0}>
      <CardMedia
        component="img"
        height={height}
        image={image?.url || NoImage}
        alt={image?.name || image?._id ? `Image: ${image?._id}` : "No Image"}
        {...rest}
      />
    </Paper>
  );
};

export default React.memo(DisplayImage);
