import { CardMedia } from "@mui/material";
import React from "react";

import { NoImage } from "../assets";

const DisplayImage = ({ image, height = "300", ...rest }) => {
  return (
    <CardMedia
      component="img"
      height={height}
      image={image?.url || NoImage}
      alt={image?.name || image?._id ? `Image: ${image?._id}` : "No Image"}
      {...rest}
    />
  );
};

export default DisplayImage;
