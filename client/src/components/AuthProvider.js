import React, { useMemo, useState, useCallback, useEffect } from "react";
import { clearFromStorage, getFromStorage, setToStorage } from "../utils";
import { getCurrentUserApi } from "../api/users";
import axiosInstance from "../api/axiosInstance";

import AuthContext from "../AuthContext";
import Loader from "./Loader";

const userAccessTokenKey = process.env.REACT_APP_USER_ACCESS_TOKEN_KEY;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [appLoaded, setAppLoaded] = useState(false);

  const getCurrentUser = useCallback(async () => {
    try {
      setError();
      const accesstoken = getFromStorage(userAccessTokenKey);
      if (!accesstoken) {
        setAppLoaded(true);
        return;
      }
      setAppLoaded(false);
      const data = await getCurrentUserApi();
      setUser(data);
    } catch (err) {
      console.log(
        err?.response?.data?.message ||
          err.message ||
          "Could not fetch your details"
      );
      setError("Could not fetch your details");
    } finally {
      setAppLoaded(true);
    }
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      setError();
      const data = await getCurrentUserApi();
      setUser(data);
    } catch (err) {
      console.log(
        err?.response?.data?.message ||
          err.message ||
          "Could not fetch your details"
      );
      setError("Could not fetch your details");
    }
  }, []);

  useEffect(() => {
    if (getFromStorage(userAccessTokenKey)) {
      setIsLoggedIn(true);
    }
    getCurrentUser();
  }, [getCurrentUser]);

  const signIn = useCallback(
    async (accesstoken, callback) => {
      setToStorage(userAccessTokenKey, accesstoken);
      setIsLoggedIn(!!accesstoken);
      await getCurrentUser();
      callback();
    },
    [getCurrentUser]
  );

  const signOut = useCallback(async (callback) => {
    setUser();
    setIsLoggedIn(false);
    clearFromStorage(userAccessTokenKey);
    callback();
  }, []);

  const authValues = useMemo(
    () => ({
      user,
      isLoggedIn,
      error,
      signIn,
      signOut,
      getCurrentUser,
      refreshCurrentUser,
    }),
    [
      user,
      isLoggedIn,
      error,
      signIn,
      signOut,
      getCurrentUser,
      refreshCurrentUser,
    ]
  );

  useEffect(() => {
    const authResponseInterceptor = axiosInstance.interceptors.response.use(
      async (response) => {
        return response;
      },
      async (error) => {
        const status = error.response.status;

        if (
          (status === 401 || status === 403) &&
          getFromStorage(userAccessTokenKey)
        ) {
          signOut(() => {
            window.location.href = "/login";
          });
        } else {
          return Promise.reject(error);
        }
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(authResponseInterceptor);
    };
  }, [signOut]);

  return (
    <AuthContext.Provider value={authValues}>
      {appLoaded ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
