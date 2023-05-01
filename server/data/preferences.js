import User from "../models/user.js";
import { userData } from "../data/index.js";

export const createPreferences = async (
  city,
  state,
  smoking,
  drinking,
  pets,
  rentMin,
  rentMax,
  ageMin,
  ageMax,
  genders
) => {
  if (!city) {
    throw {
      status: 400,
      message: "City is required!",
    };
  }

  if (!state) {
    throw {
      status: 400,
      message: "State is required!",
    };
  }

  if (typeof smoking !== "boolean") {
    throw {
      status: 400,
      message: "Smoking preference is required!",
    };
  }

  if (typeof drinking !== "boolean") {
    throw {
      status: 400,
      message: "Drinking preference is required!",
    };
  }

  if (typeof pets !== "boolean") {
    throw {
      status: 400,
      message: "Pet preference is required!",
    };
  }

  if (!rentMin) {
    throw {
      status: 400,
      message: "Minimum rent is required!",
    };
  }

  if (!rentMax) {
    throw {
      status: 400,
      message: "Maximum rent is required!",
    };
  }

  if (!ageMin) {
    throw {
      status: 400,
      message: "Minimum age is required!",
    };
  }

  if (!ageMax) {
    throw {
      status: 400,
      message: "Maximum age is required!",
    };
  }

  if (!/\d{3,}/.test(rentMin)) {
    throw {
      status: 400,
      message: "Minimum rent must be a 3 digit-number!",
    };
  }

  if (!/\d{3,}/.test(rentMax)) {
    throw {
      status: 400,
      message: "Maximum rent must be a 3 digit-number!",
    };
  }

  if (!/\d{2,}/.test(ageMin) || parseInt(ageMin) < 13) {
    throw {
      status: 400,
      message: "Minimum age must be a 2 digit-number geater than 13!",
    };
  }

  if (
    !/\d{2,}/.test(ageMax) ||
    parseInt(ageMax) < 13 ||
    parseInt(ageMax) > 99
  ) {
    throw {
      status: 400,
      message: "Maximum age must be a 2-digit-number between 13 and 99!",
    };
  }

  if (parseInt(ageMin) === parseInt(ageMax)) {
    throw {
      status: 400,
      message: "Minimum age must be less than maximum age!",
    };
  }

  if (parseInt(ageMin) > parseInt(ageMax)) {
    throw {
      status: 400,
      message: "Minimum age must be less than maximum age!",
    };
  }

  if (parseInt(rentMin) === parseInt(rentMax)) {
    throw {
      status: 400,
      message: "Minimum rent must be less than maximum rent!",
    };
  }

  if (parseInt(rentMin) > parseInt(rentMax)) {
    throw {
      status: 400,
      message: "Minimum rent must be less than maximum rent!",
    };
  }

  if (!Array.isArray(genders)) {
    throw {
      status: 400,
      message: "Genders is required! Must be an array!",
    };
  }

  if (genders.length < 1) {
    throw {
      status: 400,
      message: "Atleast one gender preference is required!",
    };
  }

  if (!genders.every((elem) => typeof elem === "string" && elem.trim())) {
    throw {
      status: 400,
      message: "Each element in gender must a non-empty string.",
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

  const userLocation = {
    city: city,
    state: state,
  };

  const newPref = {
    smoking: smoking,
    drinking: drinking,
    pets: pets,
    rent: {
      min: rentMin,
      max: rentMax,
    },
    age: {
      min: ageMin,
      max: ageMax,
    },
    genders: genders,
  };

  const { email } = req.currentUser;
  // const email = "veeramachaneninihash@gmail.com";
  try {
    //const userDetails = await userData.getUserProfile(email);
    const user = await User.findOne({ email: email });
    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
      };
    }

    user.location = userLocation;
    user.preferences = newPref;
    await user.save();
    const userDetailsAfterInsert = await User.findOne({ email: email });
    return userDetailsAfterInsert;
  } catch (e) {
    return e.status
      ? res.status(e.status).json(e.message)
      : res.status(500).json("Internal server error");
  }
};
