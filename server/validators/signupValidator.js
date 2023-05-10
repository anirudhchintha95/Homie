import {
  isValidEmail,
  isValidPassword,
  validateDOB,
} from "../validators/helpers.js";

export const signupValidator = (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phoneNumber,
      gender,
    } = req.body;
    if (!firstName) {
      throw { status: 400, message: "First name must be a non-empty string" };
    }

    if (!lastName) {
      throw { status: 400, message: "Last name must be a non-empty string" };
    }

    if (!email) {
      throw { status: 400, message: "Email must be a non-empty string" };
    }

    if (!password) {
      throw { status: 400, message: "Password must be a non-empty string" };
    }

    if (!dateOfBirth) {
      throw { status: 400, message: "Date of birth is required" };
    }

    if (!phoneNumber) {
      throw { status: 400, message: "Phone number is required" };
    }

    if (!gender) {
      throw { status: 400, message: "Gender is required" };
    }

    if (!/^[a-zA-Z\s]*$/.test(firstName)) {
      throw {
        status: 400,
        message: "First name must contain only letters and spaces",
      };
    }

    if (!/^[a-zA-Z\s]*$/.test(lastName)) {
      throw {
        status: 400,
        message: "Last name must contain only letters and spaces",
      };
    }

    if (firstName.length > 25) {
      throw {
        status: 400,
        message: "First name must be less than 50 characters",
      };
    }

    if (lastName.length > 25) {
      throw {
        status: 400,
        message: "Last name must be less than 50 characters",
      };
    }

    if (!isValidEmail(email)) {
      throw { status: 400, message: "Email must be a valid email address" };
    }

    if (!isValidPassword(password)) {
      throw {
        status: 400,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.",
      };
    }

    if (!validateDOB(dateOfBirth)) {
      throw { status: 400, message: "Date of birth must be a valid date" };
    }

    if (!/^[0-9]*$/.test(phoneNumber)) {
      throw {
        status: 400,
        message: "Phone number must contain only numbers",
      };
    }

    if (phoneNumber.length !== 10) {
      throw {
        status: 400,
        message: "Phone number must be 10 digits long",
      };
    }

    if (gender !== "Male" && gender !== "Female" && gender !== "Non-Binary") {
      throw {
        status: 400,
        message: "Gender must be Male, Female or Non-Binary",
      };
    }

    next();
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
};
