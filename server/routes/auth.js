import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

import { auth } from "../data/index.js";
import { loginValidator } from "../validators/loginValidator.js";
import { signupValidator } from "../validators/signupValidator.js";
import JwtService from "../services/jwt-service.js";

const router = Router();
router.route("/login").post(loginValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accesstoken = user.generateToken();

    res.json({ message: "Login successful", accesstoken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.route("/signup").post(signupValidator, async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, phone, gender } =
      req.body;

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
    return res.status(error.status||500).json({ error: error.message });
  }
});

export default router;
