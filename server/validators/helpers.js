import { isValidObjectId } from "mongoose";

function isValidEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) return false;
  return true;
}

function isValidPassword(password) {
  if (!password || password.length < 5) return false;
  return true;
}

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

export {
  isValidEmail,
  isValidPassword,
  checkBoolean,
  validateNumber,
  validateNumberRange,
  validateString,
  validateId,
};
