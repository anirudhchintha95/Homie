import React, { useMemo, useState, useCallback, useEffect } from "react";
import { clearFromStorage, getFromStorage, setToStorage } from "../utils";
import AuthContext from "../AuthContext";

const userKey = process.env.REACT_APP_USER_KEY;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    setUser(getFromStorage(userKey) || null);
    setAppLoaded(true);
  }, []);

  const signIn = useCallback(async (loggedInUser, callback) => {
    setUser(loggedInUser);
    setToStorage(userKey, loggedInUser);
    callback();
  }, []);

  const signOut = useCallback(async (callback) => {
    setUser();
    clearFromStorage(userKey);
    callback();
  }, []);

  const authValues = useMemo(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={authValues}>
      {appLoaded ? children : <>Loading</>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
