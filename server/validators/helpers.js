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

export {
  isValidEmail,
  isValidPassword,
  checkBoolean,
  validateNumber,
  validateNumberRange,
  validateString,
  validateId,
  validatePassword,
  validatePreferencesBE,
};
