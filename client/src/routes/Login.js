import { Button } from "@mui/material";
import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import useAuth from "../useAuth";
import { loginApi } from "../api/auth";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const login = async (e) => {
    try {
      // Login API call
      const res = await loginApi("john.doe@gmail.com", "password");
      await auth.signIn(res?.accesstoken, () => {
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
      <Button
        variant="contained"
        onClick={login}
        LinkComponent={Link}
        href="/signup"
      >
        Signup
      </Button>
    </div>
  );
};

export default Login;
