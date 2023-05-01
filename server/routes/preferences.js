import { Router } from "express";
import User from "../models/user.js";

import { preferenceData } from "../data/index.js";
const router = Router();

router.route("/").post(async (req, res) => {
  try {
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
    } = req.body;

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

    if (typeof smoking !== "boolean") {
      throw {
        status: 400,
        message: "Error: Smoking preference is required!",
      };
    }

    if (typeof drinking !== "boolean") {
      throw {
        status: 400,
        message: "Error: Drinking preference is required!",
      };
    }

    if (typeof pets !== "boolean") {
      throw {
        status: 400,
        message: "Error: Pet preference is required!",
      };
    }

    if (!rentMin) {
      throw {
        status: 400,
        message: "Error: Minimum rent is required!",
      };
    }

    if (!rentMax) {
      throw {
        status: 400,
        message: "Error: Maximum rent is required!",
      };
    }

    if (!ageMin) {
      throw {
        status: 400,
        message: "Error: Minimum age is required!",
      };
    }

    if (!ageMax) {
      throw {
        status: 400,
        message: "Error: Maximum age is required!",
      };
    }

    if (!/\d{3,}/.test(rentMin)) {
      throw {
        status: 400,
        message: "Error: Minimum rent must be a 3 digit-number!",
      };
    }

    if (!/\d{3,}/.test(rentMax)) {
      throw {
        status: 400,
        message: "Error: Maximum rent must be a 3 digit-number!",
      };
    }

    if (!/\d{2,}/.test(ageMin) || parseInt(ageMin) < 13) {
      throw {
        status: 400,
        message: "Error: Minimum age must be a 2 digit-number geater than 13!",
      };
    }

    if (
      !/\d{2,}/.test(ageMax) ||
      parseInt(ageMax) < 13 ||
      parseInt(ageMax) > 99
    ) {
      throw {
        status: 400,
        message:
          "Error: Maximum age must be a 2-digit-number between 13 and 99!",
      };
    }

    if (parseInt(ageMin) === parseInt(ageMax)) {
      throw {
        status: 400,
        message: "Error: Minimum age must be less than maximum age!",
      };
    }

    if (parseInt(ageMin) > parseInt(ageMax)) {
      throw {
        status: 400,
        message: "Error: Minimum age must be less than maximum age!",
      };
    }

    if (parseInt(rentMin) === parseInt(rentMax)) {
      throw {
        status: 400,
        message: "Error: Minimum rent must be less than maximum rent!",
      };
    }

    if (parseInt(rentMin) > parseInt(rentMax)) {
      throw {
        status: 400,
        message: "Error: Minimum rent must be less than maximum rent!",
      };
    }

    if (!Array.isArray(genders)) {
      throw {
        status: 400,
        message: "Error: Genders is required! Must be an array!",
      };
    }

    if (genders.length < 1) {
      throw {
        status: 400,
        message: "Error: Atleast one gender preference is required!",
      };
    }

    if (!genders.every((elem) => typeof elem === "string" && elem.trim())) {
      throw {
        status: 400,
        message: "Error: Each element in gender must a non-empty string.",
      };
    }

    const gendersArr = ["Male", "Female", "Non-Binary"];
    if (!genders.every((elem) => gendersArr.includes(elem))) {
      throw {
        status: 400,
        message:
          "Error: Each element in gender must be either Male, Female or Non-Binary.",
      };
    }

    const user = await preferenceData.createPreferences(
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
    );
    return res.json(user);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;
