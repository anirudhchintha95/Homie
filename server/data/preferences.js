import User from "../models/user.js";
import { userData } from "../data/index.js";

export const createPreferences = async (preferences, email) => {
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
      message: "City is required!",
    };
  }

  if (!state) {
    throw {
      status: 400,
      message: "State is required!",
    };
  }

  // if (typeof smoking !== "boolean") {
  //   throw {
  //     status: 400,
  //     message: "Smoking preference is required!",
  //   };
  // }

  // if (typeof drinking !== "boolean") {
  //   throw {
  //     status: 400,
  //     message: "Drinking preference is required!",
  //   };
  // }

  // if (typeof pets !== "boolean") {
  //   throw {
  //     status: 400,
  //     message: "Pet preference is required!",
  //   };
  // }

  // if (!rentMin) {
  //   throw {
  //     status: 400,
  //     message: "Minimum rent is required!",
  //   };
  // }

  // if (!rentMax) {
  //   throw {
  //     status: 400,
  //     message: "Maximum rent is required!",
  //   };
  // }

  // if (!ageMin) {
  //   throw {
  //     status: 400,
  //     message: "Minimum age is required!",
  //   };
  // }

  // if (!ageMax) {
  //   throw {
  //     status: 400,
  //     message: "Maximum age is required!",
  //   };
  // }

  // if (!/\d{3,}/.test(rentMin)) {
  //   throw {
  //     status: 400,
  //     message: "Minimum rent must be a 3 digit-number!",
  //   };
  // }

  // if (!/\d{3,}/.test(rentMax)) {
  //   throw {
  //     status: 400,
  //     message: "Maximum rent must be a 3 digit-number!",
  //   };
  // }

  // if (!/\d{2,}/.test(ageMin) || parseInt(ageMin) < 13) {
  //   throw {
  //     status: 400,
  //     message: "Minimum age must be a 2 digit-number geater than 13!",
  //   };
  // }

  // if (
  //   !/\d{2,}/.test(ageMax) ||
  //   parseInt(ageMax) < 13 ||
  //   parseInt(ageMax) > 99
  // ) {
  //   throw {
  //     status: 400,
  //     message: "Maximum age must be a 2-digit-number between 13 and 99!",
  //   };
  // }

  // if (parseInt(ageMin) === parseInt(ageMax)) {
  //   throw {
  //     status: 400,
  //     message: "Minimum age must be less than maximum age!",
  //   };
  // }

  // if (parseInt(ageMin) > parseInt(ageMax)) {
  //   throw {
  //     status: 400,
  //     message: "Minimum age must be less than maximum age!",
  //   };
  // }

  // if (parseInt(rentMin) === parseInt(rentMax)) {
  //   throw {
  //     status: 400,
  //     message: "Minimum rent must be less than maximum rent!",
  //   };
  // }

  // if (parseInt(rentMin) > parseInt(rentMax)) {
  //   throw {
  //     status: 400,
  //     message: "Minimum rent must be less than maximum rent!",
  //   };
  // }

  // if (!Array.isArray(genders)) {
  //   throw {
  //     status: 400,
  //     message: "Genders is required! Must be an array!",
  //   };
  // }

  // if (genders.length < 1) {
  //   throw {
  //     status: 400,
  //     message: "Atleast one gender preference is required!",
  //   };
  // }

  // if (!genders.every((elem) => typeof elem === "string" && elem.trim())) {
  //   throw {
  //     status: 400,
  //     message: "Each element in gender must a non-empty string.",
  //   };
  // }

  // const gendersArr = ["Male", "Female", "Non-Binary"];
  // if (!genders.every((elem) => gendersArr.includes(elem))) {
  //   throw {
  //     status: 400,
  //     message:
  //       "Each element in gender must be either Male, Female or Non-Binary.",
  //   };
  // }

  let userLocation = {};

  userLocation = {
    city: city,
    state: state,
  };

  const newPref = {};

  if (typeof smoking === "boolean") {
    newPref.smoking = smoking;
  }

  if (typeof drinking === "boolean") {
    newPref.drinking = drinking;
  }

  if (typeof pets === "boolean") {
    newPref.pets = pets;
  }

  if (
    (rentMin !== undefined && rentMax !== undefined) ||
    (typeof rentMin === "string" && typeof rentMax === "string")
  ) {
    newPref.rent = {
      min: parseInt(rentMin) * 100,
      max: parseInt(rentMax) * 100,
    };
  }

  if (
    (ageMin !== undefined && ageMax !== undefined) ||
    (typeof ageMin === "string" && typeof ageMax === "string")
  ) {
    newPref.age = { min: parseInt(ageMin), max: parseInt(ageMax) };
  }

  if (genders !== undefined) {
    newPref.genders = genders;
  }

  try {
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
    //return true;
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }
};

export const updatePreferences = async (preferences, email) => {
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

  let userLocation = {};

  if (typeof city !== "undefined") {
    userLocation.city = city;
  }

  if (typeof state !== "undefined") {
    userLocation.state = state;
  }

  const newPref = {};
  const deletePref = {};

  if (typeof smoking === "boolean") {
    newPref.smoking = smoking;
  }

  if (smoking === null) {
    deletePref.smoking = undefined;
  }

  if (typeof drinking === "boolean") {
    newPref.drinking = drinking;
  }

  if (drinking === null) {
    deletePref.drinking = undefined;
  }

  if (typeof pets === "boolean") {
    newPref.pets = pets;
  }

  if (pets === null) {
    deletePref.pets = undefined;
  }

  // if (
  //   (rentMin !== undefined && rentMax !== undefined) ||
  //   (typeof rentMin === "string" && typeof rentMax === "string")
  // ) {
  //   newPref.rent = { min: parseInt(rentMin), max: parseInt(rentMax) };
  // }

  if (typeof rentMin === "number" && typeof rentMax === "number") {
    newPref.rent = { min: parseInt(rentMin), max: parseInt(rentMax) };
  }

  if (typeof rentMin === "object" && typeof rentMax === "object") {
    deletePref.rent = { min: undefined, max: undefined };
  }

  if (typeof ageMin === "number" && typeof ageMax === "number") {
    newPref.age = { min: parseInt(ageMin), max: parseInt(ageMax) };
  }

  if (typeof ageMin === "object" && typeof ageMax === "object") {
    deletePref.age = { min: undefined, max: undefined };
  }

  if (genders !== undefined) {
    newPref.genders = genders;
  }

  // console.log(
  //   Object.keys(userLocation).length === 0 ? "Location empty" : userLocation
  // );
  // console.log(
  //   Object.keys(newPref).length === 0 ? "Preferences empty" : newPref
  // );
  // console.log(
  //   Object.keys(deletePref).length === 0 ? "Delete empty" : deletePref
  // );

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
      };
    }

    if (Object.keys(userLocation).length >= 1) {
      if (userLocation.city !== undefined) {
        user.location.city = userLocation.city;
      }
      if (userLocation.state !== undefined) {
        user.location.state = userLocation.state;
      }
      await user.save();
    }

    if (Object.keys(newPref).length >= 1) {
      if (newPref.smoking !== undefined) {
        user.preferences.smoking = newPref.smoking;
      }
      if (newPref.drinking !== undefined) {
        user.preferences.drinking = newPref.drinking;
      }
      if (newPref.pets !== undefined) {
        user.preferences.pets = newPref.pets;
      }

      if (newPref.rent) {
        if (newPref.rent.max !== undefined && newPref.rent.min !== undefined) {
          user.preferences.rent = {
            min: newPref.rent.min,
            max: newPref.rent.max,
          };
        }
      }

      if (newPref.age) {
        if (newPref.age.max !== undefined && newPref.age.min !== undefined) {
          user.preferences.age = { min: newPref.age.min, max: newPref.age.max };
        }
      }

      if (newPref.genders !== undefined) {
        user.preferences.genders = newPref.genders;
      }

      await user.save();
    }

    // );

    if (Object.keys(deletePref).length >= 1) {
      // const removePreferences = await User.updateOne(
      //   { _id: user._id },
      //   { $unset: { "preferences.pets" : ""} }
      // );

      if (deletePref.smoking === undefined) {
        user.preferences.smoking = undefined;
      }

      if (deletePref.drinking === undefined) {
        user.preferences.drinking = undefined;
      }

      if (deletePref.pets === undefined) {
        user.preferences.pets = undefined;
      }

      if (deletePref.rent) {
        //user.preferences.rent = {max:undefined , min:undefined} ;
        user.preferences.rent = undefined;
      }

      if (deletePref.age) {
        //user.preferences.age = {max:undefined , min:undefined} ;
        user.preferences.age = undefined;
      }

      await user.save();
    }

    const userPreferencesafterChange = await User.findOne({ email: email });
    //  console.log(userPreferencesafterChange.preferences);

    return userPreferencesafterChange;
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  //return true;
};
