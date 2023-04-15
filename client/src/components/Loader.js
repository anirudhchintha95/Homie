import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { HomieLogoWhite } from "../assets";

const Loader = ({ useCircularLoader = false }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
    >
      {useCircularLoader ? (
        <CircularProgress color="inherit" />
      ) : (
        <img
          src={HomieLogoWhite}
          alt="Homie Logo"
          className="animate-flicker"
          style={{ height: "240px", width: "240px", opaacity: "1" }}
        />
      )}
    </Backdrop>
  );
};

export default Loader;
