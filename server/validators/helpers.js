import { isValidObjectId } from "mongoose";
import { GENDERS } from "../constants.js";
import { DateTime } from "luxon";
import { City, State, Country } from "country-state-city";

const COUNTRY_CODE = "US";

const validateStateAndCity = (state, city) => {
  state = validateString(state, "State");
  city = validateString(city, "City");

  const stateObj = State.getStateByCodeAndCountry(state, COUNTRY_CODE);
  if (!stateObj) {
    throw { status: 400, message: "Invalid State" };
  }
  const cityObj = City.getCitiesOfState(COUNTRY_CODE, state)?.find(
    (c) => c.name === city && c.stateCode === state
  );
  if (!cityObj) {
    throw { status: 400, message: "Invalid City" };
  }
  return {
    state: cityObj.stateCode,
    city: cityObj.name,
  };
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

const validateEmail = (email, variableName = "Email") => {
  if (typeof email !== "string") {
    throw {
      status: 400,
      message: `${variableName} must be a string!`,
    };
  }
  if (!email) {
    throw {
      status: 400,
      message: `${variableName} is required!`,
    };
  }
  email = email?.trim()?.toLowerCase();
  if (!email?.length) {
    throw {
      status: 400,
      message: `${variableName} must not be empty!`,
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw { status: 400, message: `Invalid ${variableName}` };
  }
  return email;
};

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

const validateString = (value, name, { minLength = 1, maxLength } = {}) => {
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
  if (!/^[1-9]\d{9}$/.test(phoneNumber)) {
    throw {
      status: 400,
      message: `${name} must contain only 10 digits and not begin with 0`,
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
  let {
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

  const { city: validatedCity, state: validatedState } = validateStateAndCity(
    state,
    city
  );
  city = validatedCity;
  state = validatedState;

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
    genders = genders.map((elem, idx) => validateString(elem, `Gender ${idx}`));

    const gendersArr = Object.values(GENDERS);
    if (!genders.every((elem) => gendersArr.includes(elem))) {
      throw {
        status: 400,
        message:
          "Each element in gender must be either Male, Female or Non-Binary.",
      };
    }
  }

  return {
    smoking,
    drinking,
    pets,
    rentMin,
    rentMax,
    ageMin,
    ageMax,
    genders,
    state,
    city,
  };
};

const validateSignUp = (preferences) => {
  let { firstName, lastName, email, password, dateOfBirth, phone, gender } =
    preferences;

  firstName = validateName(firstName, "First Name");
  lastName = validateName(lastName, "Last Name");
  email = validateEmail(email);
  password = validatePassword(password);
  dateOfBirth = validateDOB(dateOfBirth);
  phone = validatePhone(phone);
  gender = validateGender(gender);

  return { firstName, lastName, email, password, dateOfBirth, phone, gender };
};

const validateName = (name, varName = "Name") => {
  name = validateString(name, varName);

  if (!/^[a-zA-Z\s]{2,25}$/.test(name)) {
    throw {
      status: 400,
      message: `${varName} must be between 2 and 25 characters long and contain only letters.`,
    };
  }

  return name;
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
  validateEmail,
  validatePreferencesBE,
  validateSignUp,
  validateName,
};
