import User from "../models/user.js";
import { loginValidator } from "../validators/loginValidator.js";
import helpers from "../validators/helpers.js";
import Home from "../models/home.js";

const exportedMethods = {
  async login(email, password) {
    loginValidator(email, password);
    // TODO: Write login code here. Throw errors here and dont catch them
  },
};

export default exportedMethods;
