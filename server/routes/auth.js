import { Router } from "express";
import User from "../models/user.js";
import xss from "xss";

import { auth } from "../data/index.js";
import { loginValidator } from "../validators/loginValidator.js";
import { signupValidator } from "../validators/signupValidator.js";
import { validateSignUp } from "../validators/helpers.js";

const router = Router();
router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = xss(email);
    const cleanPassword = xss(password);

    if (!cleanEmail.trim() || !cleanPassword) {
      throw { status: 400, message: "Invalid credentials" };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail.trim())) {
      throw { status: 400, message: "Invalid credentials" };
    }
    if (
      !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(
        cleanPassword
      )
    ) {
      throw { status: 400, message: "Invalid credentials" };

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
