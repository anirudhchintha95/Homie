import { createContext } from "react";

const AuthContext = createContext({
  user: {},
  signIn: () => {},
  signOut: () => {},
});

export default AuthContext;
