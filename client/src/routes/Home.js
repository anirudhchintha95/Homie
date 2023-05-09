import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

import "../homepage.css";
import useAuth from "../useAuth";

const Home = () => {
  const auth = useAuth();
  return (
    <div className="home-container">
      <h1 className="title">Welcome to Homie!</h1>
      <p className="description">
        Your go-to platform for finding the perfect roommate and a cozy place to
        call home!
      </p>
      <p className="first-paragraph">
        Finding a roommate can be daunting, but Homie matches you with
        like-minded individuals based on your unique requirements.
      </p>
      <p className="second-paragraph">
        Say goodbye to sifting through creepy Craigslist ads or dealing with
        sketchy potential roommates. Homie provides a safe and secure platform
        to connect with people who share your values and lifestyle.
      </p>
      <p className="third-paragraph">
        Sign up today and start your journey to finding the perfect roommate and
        a cozy place to call home!
      </p>
      {auth?.isLoggedIn ? (
        <Button
          variant="contained"
          LinkComponent={Link}
          to="/homies"
          className="signup-button"
        >
          Start Hunting
        </Button>
      ) : (
        <div className="button-container">
          <Button
            variant="outlined"
            LinkComponent={Link}
            to="/signup"
            className="signup-button"
          >
            Sign up
          </Button>
          <Button
            variant="contained"
            LinkComponent={Link}
            to="/login"
            className="login-button"
          >
            Login
          </Button>
        </div>
      )}
      <p className="footer">A project by CS546 Group 31</p>
    </div>
  );
};

export default Home;
