import { Router } from "express";

import { login } from "../controllers/auth.controller.js";
import { loginRouteValidator } from "../validators/loginValidator.js";

const authRouter = Router();

authRouter.route("/login").post(loginRouteValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
});

export default authRouter;
