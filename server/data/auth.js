import User from "../models/user.js";
import { loginValidator } from "../validators/loginValidator.js";
import { signupValidator } from "../validators/signupValidator.js";

export const login = async (email, password) => {
  loginValidator(email, password);
  // TODO: Write login code here. Throw errors here and dont catch them
};

export const signup = async (
  firstName,
  lastName,
  email,
  password,
  dateOfBirth,
  phone,
  gender
) => {
  signupValidator(email, password);
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user1 = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      encryptedPassword: encryptedPassword,
      dateOfBirth: new Date(dateOfBirth),
      phone: phone,
      gender: gender,
    });
  } catch (error) {
    throw error.toString();
  }
};
