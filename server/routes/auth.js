import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
// import { auth } from "../data/index.js";
import { loginValidator } from "../validators/loginValidator.js";
import JwtService from "../services/jwt-service.js";

const router = Router();
router.route("/login").post(loginValidator, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.encryptedPassword
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accesstoken = JwtService.encrypt({
            _id: user._id,
            email: user.email,
        });

        res.json({ message: "Login successful", accesstoken });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
