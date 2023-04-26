import React from "react";
import { Routes as BrowserRoutes, Outlet, Route } from "react-router-dom";

import { Layout, RequiresAuth } from "../components";

import About from "./About";
import Account from "./Account";
import FindMyHomies from "./FindMyHomies";
import Login from "./Login";
import MyHomies from "./MyHomies";
import NotFound from "./NotFound";
import Preferences from "./Preferences";
import Signup from "./Signup";
import Home from "./Home";
import HomieInfo from "./HomieInfo";

const Routes = () => {
  return (
    <BrowserRoutes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/homies"
          element={
            <RequiresAuth>
              <Outlet />
            </RequiresAuth>
          }
        >
          <Route index element={<FindMyHomies />} />
          <Route path=":id" element={<HomieInfo />} />
        </Route>
        <Route
          path="/account"
          element={
            <RequiresAuth>
              <Account />
            </RequiresAuth>
          }
        />
        <Route
          path="/my-homies"
          element={
            <RequiresAuth>
              <MyHomies />
            </RequiresAuth>
          }
        />
        <Route
          path="/preferences"
          element={
            <RequiresAuth>
              <Preferences />
            </RequiresAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </BrowserRoutes>
  );
};

export default Routes;
