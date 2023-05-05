import { Router } from "express";
import User from "../models/user.js";
import { preferenceData } from "../data/index.js";
import { validatePreferencesBE } from "../validators/helpers.js";
import xss from "xss";

const router = Router();

router.route("/").post(async (req, res) => {
  try {
    const {
      smoking,
      drinking,
      pets,
      city,
      state,
      rentMin,
      rentMax,
      ageMin,
      ageMax,
      genders,
    } = req.body;

    const cleanCity = xss(city);
    const cleanState = xss(state);
    const cleanGenders = req.body.genders.map((gender) => xss(gender));

    const cleanReqBody = {
      smoking,
      drinking,
      pets,
      city: cleanCity,
      state: cleanState,
      rentMin,
      rentMax,
      ageMin,
      ageMax,
      genders: cleanGenders,
    };

    const validatePref = validatePreferencesBE(cleanReqBody);

    const user = await preferenceData.createPreferences(
      cleanReqBody,
      req.currentUser.email.toLowerCase()
    );
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

router.route("/").patch(async (req, res) => {
  try {
    const validatePref = validatePreferencesBE(req.body);
    const user = await preferenceData.updatePreferences(
      req.body,
      req.currentUser.email.toLowerCase()
    );
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;