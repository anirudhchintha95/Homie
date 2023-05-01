import { createContext } from "react";

const AuthContext = createContext({
  user: {},
  isLoggedIn: false,
  error: "",
  refreshCurrentUser: () => ({}),
  getCurrentUser: () => ({}),
  signIn: () => {},
  signOut: () => {},
});

export default AuthContext;
