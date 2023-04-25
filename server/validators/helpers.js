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

export {
  isValidEmail,
  isValidPassword,
  checkBoolean,
  validateNumber,
  validateNumberRange,
};
