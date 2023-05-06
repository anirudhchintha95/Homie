import User from "../models/user.js";
import PasswordService from "../services/password-service.js";
import { loginValidator } from "../validators/loginValidator.js";
import { signupValidator } from "../validators/signupValidator.js";
import { validateSignUp } from "../validators/helpers.js";

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
  //signupValidator(firstName, lastName, email, password, dateOfBirth, phone, gender);

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
      firstName: firstName,
      lastName: lastName,
      email: email,
      encryptedPassword: encryptedPassword,
      dateOfBirth: new Date(dateOfBirth),
      phone: phone,
      gender: gender,
    });

    return user;
  } catch (error) {
    throw { status: 400, message: error.message };
  }
};
