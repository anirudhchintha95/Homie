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
    let { firstName, lastName, email, password, dateOfBirth, phone, gender } =
      req.body;

    firstName = xss(firstName);
    lastName = xss(lastName);
    email = xss(email);
    password = xss(password);
    dateOfBirth = xss(dateOfBirth);
    phone = xss(phone);
    gender = xss(gender);

    let signUpDetails = validateSignUp({
      firstName, lastName, email, password, dateOfBirth, phone, gender
    });

    const user = await auth.signup(signUpDetails);

    const accesstoken = user.generateToken();
    res.json({ accesstoken });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;
