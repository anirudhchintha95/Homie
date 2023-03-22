import { Button } from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useAuth from "../useAuth";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const login = async (e) => {
    try {
      auth.signIn({ firstName: "Patrik", lastName: "Hill" }, () => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from || "/", {
          replace: true,
        });
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      <Button variant="contained" onClick={login}>
        Login
      </Button>
    </div>
  );
};

export default Login;
