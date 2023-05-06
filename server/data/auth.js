import User from "../models/user.js";
import PasswordService from "../services/password-service.js";
import {
  validateEmail,
  validatePassword,
  validateSignUp,
} from "../validators/helpers.js";

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

export const signup = async (
  firstName,
  lastName,
  email,
  password,
  dateOfBirth,
  phone,
  gender
) => {
  validateSignUp({
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    phone,
    gender,
  });

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    throw { status: 400, message: "User already exists" };
  }
  try {
    const encryptedPassword = await new PasswordService(password).encrypt();
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      encryptedPassword: encryptedPassword,
      dateOfBirth: new Date(dateOfBirth),
      phone: phone.trim(),
      gender: gender,
    });

    return user;
  } catch (error) {
    throw { status: 400, message: error.message };
  }
};
