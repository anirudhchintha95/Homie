import User from "../models/user.js";
import { userData } from "../data/index.js";
import { validatePreferencesBE } from "../validators/helpers.js";

export const createPreferences = async (preferences, email) => {
  const validatedPref = validatePreferencesBE(preferences);

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
  } = validatedPref;

  const userLocation = {
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
    (typeof rentMin === "number" && typeof rentMax === "number")
  ) {
    newPref.rent = {
      min: rentMin * 100,
      max: rentMax * 100,
    };
  }

  if (
    (ageMin !== undefined && ageMax !== undefined) ||
    (typeof ageMin === "number" && typeof ageMax === "number")
  ) {
    newPref.age = { min: ageMin, max: ageMax };
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
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }
};

export const updatePreferences = async (preferences, email) => {
  const validatedPref = validatePreferencesBE(preferences);

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
  } = validatedPref;

  const userLocation = {
    city,
    state,
  };

  const newPref = {};
  const deletePref = {};

  if (typeof smoking === "boolean") {
    newPref.smoking = smoking;
  }

  if (smoking === "") {
    deletePref.smoking = "undefined";
  }

  if (typeof drinking === "boolean") {
    newPref.drinking = drinking;
  }

  if (drinking === "") {
    deletePref.drinking = "undefined";
  }

  if (typeof pets === "boolean") {
    newPref.pets = pets;
  }

  if (pets === "") {
    deletePref.pets = "undefined";
  }

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

    if (Object.keys(deletePref).length >= 1) {
      if (deletePref.smoking === "undefined") {
        user.preferences.smoking = undefined;
      }

      if (deletePref.drinking === "undefined") {
        user.preferences.drinking = undefined;
      }

      if (deletePref.pets === "undefined") {
        user.preferences.pets = undefined;
      }

      if (deletePref.rent) {
        user.preferences.rent = undefined;
      }

      if (deletePref.age) {
        user.preferences.age = undefined;
      }

      await user.save();
    }

    await user.save();

    const userPreferencesafterChange = await User.findOne({ email: email });

    return userPreferencesafterChange;
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }
};
