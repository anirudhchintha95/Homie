import { CardMedia } from "@mui/material";
import React from "react";

const DisplayImage = ({ image, height = "300", ...rest }) => {
  return (
    <CardMedia
      component="img"
      height={height}
      image={image?.url}
      alt={image?.name || `Image: ${image._id}`}
      {...rest}
    />
  );
};

export default DisplayImage;
