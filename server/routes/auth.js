import { Router } from "express";
import User from "../models/user.js";

import { auth } from "../data/index.js";
import { loginValidator } from "../validators/loginValidator.js";
import { signupValidator } from "../validators/signupValidator.js";
import { validateSignUp } from "../validators/helpers.js";

const router = Router();
router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.trim() || !password) {
      throw { status: 400, message: "Invalid credentials" };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw { status: 400, message: "Invalid credentials" };
    }
    if (
      !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      throw { status: 400, message: "Invalid credentials" };
    }

    const user = await auth.login(email, password);
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

    validateSignUp({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phone,
      gender,
    });

    const user = await auth.signup(
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      phone,
      gender
    );

    const accesstoken = user.generateToken();
    res.json({ accesstoken });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;
