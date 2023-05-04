import React from "react";
import { Link } from "react-router-dom";
import "../homepage.css";

const Home = () => {
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
      <div className="button-container">
        <Link to="/signup">
          <button className="signup-button">Sign up</button>
        </Link>
        <Link to="/login">
          <button className="login-button">Log in</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
