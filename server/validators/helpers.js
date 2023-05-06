import { isValidObjectId } from "mongoose";
import { GENDERS } from "../constants.js";
import { DateTime } from "luxon";

function isValidEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) return false;
  return true;
}

function isValidPassword(password) {
  if (
    !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    return false;
  }
  return true;
}

const validatePassword = (password, variableName = "Password") => {
  if (!password) {
    throw {
      status: 400,
      message: `${variableName} is required!`,
    };
  }
  if (
    !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    throw {
      status: 400,
      message: `${variableName} must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.`,
    };
  }
  return password;
};

const checkBoolean = (value) => {
  if (typeof value === "boolean") {
    return true;
  }
  return false;
};

const validateString = (value, name, opts = {}) => {
  const { minLength, maxLength } = opts || { minLength: 1 };

  if (!value) {
    throw { status: 400, message: `${name} is required!` };
  }

  if (typeof value !== "string") {
    throw { status: 400, message: `${name} is not a string!` };
  }

  value = value.trim();

  if (!value) {
    throw { status: 400, message: `${name} is required!` };
  }

  if (value.length < minLength) {
    throw {
      status: 400,
      message: `${name} must be at least ${minLength} characters long!`,
    };
  }
  if (maxLength && value.length > maxLength) {
    throw {
      status: 400,
      message: `${name} must be no more than ${maxLength} characters long!`,
    };
  }
  if (["firstName", "lastName"].includes(name) && value.match(/[0-9]/g)) {
    throw {
      status: 400,
      message: `${name} must not contain numbers`,
    };
  }
  return value;
};

const validateNumber = (value, name) => {
  if (typeof value !== "number") {
    throw { status: 400, message: `${name} is not a number!` };
  }
  if (isNaN(value)) {
    throw { status: 400, message: `${name} is not a number!` };
  }
};

const validateNumberRange = (value, name, opts = {}) => {
  const { min, max, includeMin, includeMax } = opts || { min: 1 };

  validateNumber(value, name);
  if (value < min && (!includeMin || value !== min)) {
    throw {
      status: 400,
      message: [
        name,
        "must be greater than",
        includeMin ? "or equal to" : "",
        min,
      ].join(" "),
    };
  }
  if (max && value > max && (!includeMax || value !== max)) {
    throw {
      status: 400,
      message: [
        name,
        "must be less than",
        includeMax ? "or equal to" : "",
        max,
      ].join(" "),
    };
  }
};

const validateId = (value, name) => {
  value = validateString(value, name);

  if (!isValidObjectId(value)) {
    throw { status: 400, message: `${name} is not a valid id!` };
  }

  return value;
};

const validateDOB = (dob, name) => {
  if (!dob) {
    throw { status: 400, message: "Date of birth is required." };
  }

  if (dob > DateTime.now()) {
    throw {
      status: 400,
      message: "Date of birth cannot be in the future.",
    };
  }
  // dob must be at least 18 years ago using luxon
  const eighteenYearsAgo = DateTime.now().minus({ years: 18 });
  if (dob > eighteenYearsAgo) {
    throw {
      status: 400,
      message: "You must be at least 18 years old to register.",
    };
  }

  // dob must be at max 100 years ago
  const oneHundredYearsAgo = DateTime.now().minus({ years: 100 });
  if (dob < oneHundredYearsAgo) {
    throw {
      status: 400,
      message: "You must be less than 100 years old to register.",
    };
  }
  return dob;
};

const validatePhone = (value, name) => {
  if (!value) {
    throw {
      status: 400,
      message: `${name} is required!`,
    };
  }
  value = value.trim();
  if (isNaN(value))
    throw { status: 400, message: `${name} must only contain numbers` };
  if (value.length != 10) {
    throw {
      status: 400,
      message: `${name} must contain 10 digits`,
    };
  }
  return value;
};

const validateGender = (value, name) => {
  if (!value) {
    throw {
      status: 400,
      message: `${name} is required!`,
    };
  }
  if (!Object.values(GENDERS).includes(value)) {
    throw {
      status: 400,
      message: `Invalid ${name}`,
    };
  }
  return value;
};

const validatePreferencesBE = (preferences) => {
  const {
    city,
    state,
    smoking,
    drinking,
    pets,
    rentMin,
    rentMax,
    ageMin,
    ageMax,
    genders,
  } = preferences;

  if (!city) {
    throw {
      status: 400,
      message: "Error: City is required!",
    };
  }

  if (!state) {
    throw {
      status: 400,
      message: "Error: State is required!",
    };
  }

  if (typeof city !== "undefined") {
    if (!/^[a-zA-Z\s]*$/.test(city)) {
      throw {
        status: 400,
        message: "Error: City should contain only alphabets",
      };
    }
  }

  if (typeof smoking !== "undefined") {
    if (smoking !== "" && smoking !== true && smoking !== false) {
      throw {
        status: 400,
        message: "Error: form Smoking should be either true or false or None",
      };
    }
  }

  if (typeof drinking !== "undefined") {
    if (drinking !== "" && drinking !== true && drinking !== false) {
      throw {
        status: 400,
        message: "Error: form Drinking should be either true or false or None",
      };
    }
  }

  if (typeof pets !== "undefined") {
    if (pets !== "" && pets !== true && pets !== false) {
      throw {
        status: 400,
        message: "Error: Pets should be either true or false or None",
      };
    }
  }

  if (
    (rentMin !== undefined && rentMax === undefined) ||
    (rentMin !== undefined && rentMax === undefined)
  ) {
    if (rentMin === undefined) {
      throw {
        status: 400,
        message: "Error: Both Minimum and Maximum Rent should be specified",
      };
    }
    if (rentMax === undefined) {
      throw {
        status: 400,
        message: "Error: Both Minimum and Maximum Rent should be specified",
      };
    }
  }

  if (rentMin !== undefined && typeof rentMin === "number") {
    if (!/^\d+$/.test(rentMin)) {
      throw {
        status: 400,
        message: "Error: Minimum Rent should be a number greater than 0",
      };
    }
    if (rentMin < 0) {
      throw {
        status: 400,
        message: "Error: Minimum Rent should be a number greater than 0",
      };
    }
  }

  if (rentMax !== undefined && typeof rentMin === "number") {
    if (!/^\d+$/.test(rentMax)) {
      throw {
        status: 400,
        message: "Error: Maximum Rent should be a number greater than 0",
      };
    }
    if (rentMax < 0) {
      throw {
        status: 400,
        message: "Error: Maximum Rent should be a number greater than 0",
      };
    }

    //TODO: Check the max value for rentMax
  }

  if (rentMin !== undefined && rentMax !== undefined && rentMin > rentMax) {
    throw {
      status: 400,
      message: "Error: Maximum Rent should be greater than Minimum Rent",
    };
  }
  if (
    typeof rentMin === "number" &&
    typeof rentMax === "number" &&
    rentMin === rentMax
  ) {
    throw {
      status: 400,
      message: "Error: Minimum Rent and Maximum Rent cannot be the same values",
    };
  }

  if ((ageMin && !ageMax) || (!ageMin && ageMax)) {
    if (!ageMin) {
      throw {
        status: 400,
        message: "Error: Both Minimum and Maximum Age should be specified",
      };
    }
    if (!ageMax) {
      throw {
        status: 400,
        message: "Error: Both Minimum and Maximum Age should be specified",
      };
    }
  }

  if (ageMin) {
    if (!/^\d+$/.test(ageMin)) {
      throw {
        status: 400,
        message: "Error: Minimum Age should be a number between 18 and 100",
      };
    }
    if (parseInt(ageMin) < 18) {
      throw {
        status: 400,
        message: "Error: Minimum Age should be a number between 18 and 100",
      };
    }
    if (parseInt(ageMin) > 100) {
      throw {
        status: 400,
        message: "Error: Minimum Age should be a number between 18 and 100",
      };
    }
  }

  if (ageMax) {
    if (!/^\d+$/.test(ageMax)) {
      throw {
        status: 400,
        message: "Error: Maximum Age should be a number between 18 and 100",
      };
    }
    if (parseInt(ageMax) < 18) {
      throw {
        status: 400,
        message: "Error: Maximum Age should be a number between 18 and 100",
      };
    }
    if (parseInt(ageMax) > 100) {
      throw {
        status: 400,
        message: "Error: Maximum Age should be a number between 18 and 100",
      };
    }
  }

  if (ageMin && ageMax && parseInt(ageMin) > parseInt(ageMax)) {
    throw {
      status: 400,
      message: "Error: Maximum Age should be greater than Minimum Age",
    };
  }

  if (ageMin && ageMax && parseInt(ageMin) === parseInt(ageMax)) {
    throw {
      status: 400,
      message: "Error: Minimum Age and Maximum Age cannot be the same values",
    };
  }

  if (genders) {
    if (!Array.isArray(genders)) {
      throw {
        status: 400,
        message: "Genders be an array!",
      };
    }

    const gendersArr = ["Male", "Female", "Non-Binary"];
    if (!genders.every((elem) => gendersArr.includes(elem))) {
      throw {
        status: 400,
        message:
          "Each element in gender must be either Male, Female or Non-Binary.",
      };
    }
  }
};

const validateSignUp = (preferences) => {
  const { firstName, lastName, email, password, dateOfBirth, phone, gender } =
    preferences;

  if (!firstName.trim()) {
    throw { status: 400, message: "First name must be a non-empty string" };
  }

  if (!lastName.trim()) {
    throw { status: 400, message: "Last name must be a non-empty string" };
  }

  if (!email.trim()) {
    throw { status: 400, message: "Email must be a non-empty string" };
  }

  if (!password) {
    throw { status: 400, message: "Password must be a non-empty string" };
  }

  if (!dateOfBirth) {
    throw { status: 400, message: "Date of birth is required" };
  }

  if (!phone.trim()) {
    throw { status: 400, message: "Phone number is required" };
  }

  if (!gender.trim()) {
    throw { status: 400, message: "Gender is required" };
  }

  if (!/^[a-zA-Z\s]*$/.test(firstName.trim())) {
    throw {
      status: 400,
      message: "First name must contain only letters and spaces",
    };
  }

  if (!/^[a-zA-Z\s]*$/.test(lastName.trim())) {
    throw {
      status: 400,
      message: "Last name must contain only letters and spaces",
    };
  }

  if (firstName.trim().length > 25) {
    throw {
      status: 400,
      message: "First name must be less than 25 characters",
    };
  }

  if (lastName.trim().length > 25) {
    throw {
      status: 400,
      message: "Last name must be less than 25 characters",
    };
  }

  if (!isValidEmail(email.trim())) {
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

  if (!/^[0-9]*$/.test(phone.trim())) {
    throw {
      status: 400,
      message: "Phone number must contain only numbers",
    };
  }

  if (phone.trim().length !== 10) {
    throw {
      status: 400,
      message: "Phone number must be 10 digits long",
    };
  }

  if (
    gender.trim() !== "Male" &&
    gender.trim() !== "Female" &&
    gender.trim() !== "Non-Binary"
  ) {
    throw {
      status: 400,
      message: "Gender must be Male, Female or Non-Binary",
    };
  }
};

export {
  isValidEmail,
  isValidPassword,
  checkBoolean,
  validateNumber,
  validateNumberRange,
  validateString,
  validateId,
  validateDOB,
  validatePhone,
  validateGender,
  validatePassword,
  validatePreferencesBE,
  validateSignUp,
};
