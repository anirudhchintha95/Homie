import { DateTime } from "luxon";
import { GENDERS } from "./contants";

const genderValues = Object.values(GENDERS);

export const getMinAndMaxDatesForDOB = () => {
  const eighteenYearsAgo = DateTime.now().minus({ years: 18 });
  const oneHundredYearsAgo = DateTime.now().minus({ years: 100 });
  return {
    minDate: oneHundredYearsAgo.toJSDate(),
    maxDate: eighteenYearsAgo.toJSDate(),
  };
};

export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: "Email is required." };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, error: "Invalid email format." };
  }
  return { isValid: true, error: "" };
};

export const validatePassword = (password, varName = "Password") => {
  if (!password) {
    return { isValid: false, error: `${varName} is required.` };
  } else if (
    !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    return {
      isValid: false,
      error: `${varName} must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.`,
    };
  }
  return { isValid: true, error: "" };
};

export const validateDOB = (dob) => {
  if (!dob) {
    return { isValid: false, error: "Date of birth is required." };
  }

  dob = DateTime.fromJSDate(dob);

  if (dob > DateTime.now()) {
    return {
      isValid: false,
      error: "Date of birth cannot be in the future.",
    };
  }
  // dob must be at least 18 years ago using luxon
  const eighteenYearsAgo = DateTime.now().minus({ years: 18 });
  if (dob > eighteenYearsAgo) {
    return {
      isValid: false,
      error: "You must be at least 13 years old to register.",
    };
  }

  // dob must be at max 100 years ago
  const oneHundredYearsAgo = DateTime.now().minus({ years: 100 });
  if (dob < oneHundredYearsAgo) {
    return {
      isValid: false,
      error: "You must be less than 100 years old to register.",
    };
  }
  return { isValid: true, error: "" };
};

export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return { isValid: false, error: "Phone number is required." };
  }
  if (!/^[1-9]\d{9}$/.test(phoneNumber)) {
    return {
      isValid: false,
      error: "Phone number must be 10 digits long and should not start with 0.",
    };
  }
  return { isValid: true, error: "" };
};

export const validateName = (name, varName = "Name") => {
  if (!name) {
    return { isValid: false, error: `${varName} is required.` };
  }

  if (!/^[a-zA-Z\s]{2,25}$/.test(name)) {
    return {
      isValid: false,
      error: `${varName} must be between 2 and 25 characters long and contain only letters.`,
    };
  }

  return { isValid: true, error: "" };
};

export const validateGender = (gender) => {
  if (!gender) {
    return { isValid: false, error: "Gender is required" };
  }

  if (!genderValues.includes(gender)) {
    return {
      isValid: false,
      error: `Gender must be one of ${genderValues.join(", ")}.`,
    };
  }

  return { isValid: true, error: "" };
};
