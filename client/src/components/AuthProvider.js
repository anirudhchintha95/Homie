import React, { useMemo, useState, useCallback, useEffect } from "react";
import { clearFromStorage, getFromStorage, setToStorage } from "../utils";
import { getCurrentUserApi } from "../api/users";

import AuthContext from "../AuthContext";
import Loader from "./Loader";

const userAccessTokenKey = process.env.REACT_APP_USER_ACCESS_TOKEN_KEY;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [error, setError] = useState(null);
  const [appLoaded, setAppLoaded] = useState(false);

  const getCurrentUser = useCallback(async () => {
    try {
      const accesstoken = getFromStorage(userAccessTokenKey);
      if (!accesstoken) {
        setAppLoaded(true);
        return;
      }
      setAppLoaded(false);
      const data = getCurrentUserApi();
      setUser(data);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Could not fetch user"
      );
    } finally {
      setAppLoaded(true);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const signIn = useCallback(
    async (accesstoken, callback) => {
      setToStorage(userAccessTokenKey, accesstoken);
      await getCurrentUser();
      callback();
    },
    [getCurrentUser]
  );

  const signOut = useCallback(async (callback) => {
    setUser();
    clearFromStorage(userAccessTokenKey);
    callback();
  }, []);

  const authValues = useMemo(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={authValues}>
      {appLoaded ? <>{error ? <>{error}</> : children}</> : <Loader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
