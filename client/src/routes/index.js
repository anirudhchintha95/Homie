import React from "react";
import { Routes as BrowserRoutes, Outlet, Route } from "react-router-dom";

import { Layout, RequiresAuth, AuthHoc } from "../components";

import About from "./About";
import Account from "./Account";
import FindMyHomies from "./FindMyHomies";
import Login from "./Login";
import MyHomies from "./MyHomies";
import NotFound from "./NotFound";
import Preferences from "./Preferences";
import CreatePreferences from "./CreatePreferences";
import Signup from "./Signup";
import Home from "./Home";
import HomieInfo from "./HomieInfo";
import Redirector from "./Redirector";

const Routes = () => {
  return (
    <BrowserRoutes>
      <Route element={<Layout />}>
        <Route index element={<Redirector />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={
            <AuthHoc>
              <Login />
            </AuthHoc>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthHoc>
              <Signup />
            </AuthHoc>
          }
        />
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
        <Route
          path="/create-preferences"
          element={
            <RequiresAuth>
              <CreatePreferences />
            </RequiresAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </BrowserRoutes>
  );
};

export default Routes;
