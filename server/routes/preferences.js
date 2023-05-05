import { Router } from "express";
import User from "../models/user.js";
import { preferenceData } from "../data/index.js";
import { validatePreferencesBE } from "../validators/helpers.js";

const router = Router();

router.route("/").post(async (req, res) => {
  try {
    const validatePref = validatePreferencesBE(req.body);
    const user = await preferenceData.createPreferences(
      req.body,
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
