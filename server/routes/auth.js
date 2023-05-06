import { Router } from "express";
import xss from "xss";

import { auth } from "../data/index.js";
import {
  validateEmail,
  validatePassword,
  validateSignUp,
} from "../validators/helpers.js";

const router = Router();
router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    let cleanEmail = xss(email);
    let cleanPassword = xss(password);

    cleanEmail = validateEmail(cleanEmail);
    cleanPassword = validatePassword(cleanPassword);

    const user = await auth.login(cleanEmail, cleanPassword);
    const accesstoken = user.generateToken();

    res.json({ message: "Login successful", accesstoken });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

router.route("/signup").post(async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, phone, gender } =
      req.body;

    const cleanFirstName = xss(firstName);
    const cleanLastName = xss(lastName);
    const cleanEmail = xss(email);
    const cleanPassword = xss(password);
    const cleanDateOfBirth = xss(dateOfBirth);
    const cleanPhone = xss(phone);
    const cleanGender = xss(gender);

    validateSignUp({
      cleanFirstName,
      cleanLastName,
      cleanEmail,
      cleanPassword,
      cleanDateOfBirth,
      cleanPhone,
      cleanGender,
    });

    const user = await auth.signup(
      cleanFirstName,
      cleanLastName,
      cleanEmail,
      cleanPassword,
      cleanDateOfBirth,
      cleanPhone,
      cleanGender
    );

    const accesstoken = user.generateToken();
    res.json({ accesstoken });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;
