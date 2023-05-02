import { isValidObjectId } from 'mongoose';
import { GENDERS } from '../constants.js';
import { DateTime } from 'luxon';

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

const checkBoolean = (value) => {
  if (typeof value === 'boolean') {
    return true;
  }
  return false;
};

const validateString = (value, name, opts = {}) => {
  const { minLength, maxLength } = opts || { minLength: 1 };

  if (!value) {
    throw { status: 400, message: `${name} is required!` };
  }

  if (typeof value !== 'string') {
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
  if (name in ['firstName', 'lastName'] && value.match(/[0-9]/g)) {
    throw {
      status: 400,
      message: `${name} must not contain numbers`,
    };
  }
  return value;
};

const validateNumber = (value, name) => {
  if (typeof value !== 'number') {
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
        'must be greater than',
        includeMin ? 'or equal to' : '',
        min,
      ].join(' '),
    };
  }
  if (max && value > max && (!includeMax || value !== max)) {
    throw {
      status: 400,
      message: [
        name,
        'must be less than',
        includeMax ? 'or equal to' : '',
        max,
      ].join(' '),
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
    throw { status: 400, message: 'Date of birth is required.' };
  }

  if (dob > DateTime.now()) {
    throw {
      status: 400,
      message: 'Date of birth cannot be in the future.',
    };
  }
  // dob must be at least 18 years ago using luxon
  const eighteenYearsAgo = DateTime.now().minus({ years: 18 });
  if (dob > eighteenYearsAgo) {
    throw {
      status: 400,
      message: 'You must be at least 18 years old to register.',
    };
  }

  // dob must be at max 100 years ago
  const oneHundredYearsAgo = DateTime.now().minus({ years: 100 });
  if (dob < oneHundredYearsAgo) {
    throw {
      status: 400,
      message: 'You must be less than 100 years old to register.',
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
};
