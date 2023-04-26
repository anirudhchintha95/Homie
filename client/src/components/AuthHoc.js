import React from "react";
import useAuth from "../useAuth";
import { Navigate } from "react-router-dom";

const AuthHoc = ({ children }) => {
  let auth = useAuth();

  if (auth?.isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthHoc;
