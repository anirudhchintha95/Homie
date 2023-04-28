import React from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../useAuth";

const Redirector = () => {
  const auth = useAuth();

  if (auth.isLoggedIn) {
    return (
      <Navigate
        to={auth?.user?.preferences?._id ? "/homies" : "create-preferences"}
      />
    );
  }
  return <Navigate to="/login" />;
};

export default Redirector;
