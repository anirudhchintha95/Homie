import React from "react";
import { useLocation, Navigate } from "react-router-dom";

import useAuth from "../useAuth";
import PageError from "./PageError";

const RequiresAuth = ({ children }) => {
  let auth = useAuth();
  let location = useLocation();

  if (!auth?.isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth?.error) {
    return (
      <PageError onRefresh={auth?.getCurrentUser}>{auth?.error}</PageError>
    );
  }

  return children;
};

export default RequiresAuth;
