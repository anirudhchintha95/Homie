import User from "../models/user.js";
import PasswordService from "../services/password-service.js";
import {
  validateEmail,
  validatePassword,
  validateSignUp,
} from "../validators/helpers.js";
import xss from "xss";

export const login = async (email, password) => {
  email = validateEmail(email);
  password = validatePassword(password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) {
      throw { status: 401, message: "Invalid credentials" };
    }

    return user;
  } catch (error) {
    throw { status: 401, message: error.message };
  }
};

export const signup = async (signupBody) => {
  let userSignup = validateSignUp(signupBody);

  const userExists = await User.findOne({ email: userSignup.email });
  if (userExists) {
    throw { status: 400, message: "User already exists" };
  }
  const phoneExists = await User.findOne({ phone: userSignup.phone });
  if (phoneExists) {
    throw { status: 400, message: "User with the phone number already exists" };
  }
  try {
    const encryptedPassword = await new PasswordService(
      xss(userSignup.password)
    ).encrypt();
    const user = await User.create({
      firstName: xss(userSignup.firstName),
      lastName: xss(userSignup.lastName),
      email: xss(userSignup.email),
      encryptedPassword: encryptedPassword,
      dateOfBirth: new Date(xss(userSignup.dateOfBirth)),
      phone: xss(userSignup.phone),
      gender: xss(userSignup.gender),
    });

    return user;
  } catch (error) {
    throw { status: 400, message: error.message };
  }
};
