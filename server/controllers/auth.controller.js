import { loginValidator } from "../validators/loginValidator.js";

export const login = async (email, password) => {
  loginValidator(email, password);
  // TODO: Write login code here. Throw errors here and dont catch them
};
