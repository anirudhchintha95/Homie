import { createContext } from "react";

const AuthContext = createContext({
  user: {},
  isLoggedIn: false,
  error: "",
  getCurrentUser: () => ({}),
  signIn: () => {},
  signOut: () => {},
});

export default AuthContext;
