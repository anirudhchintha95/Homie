import { Router } from "express";
import { userData } from "../data/index.js";
import { loginRouteValidator } from "../validators/loginValidator.js";

const authRouter = Router();

authRouter.route("/login").post(loginRouteValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await auth.login(email, password);
    res.json(result);
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
});

authRouter.route("/me").get(async (req, res) => {
  const { email } = req.body;
  try {
    const userProfile = await userData.getUserProfile(email);

    return res.status(200).json(userProfile);
  } catch (e) {
    return res.json(e);
  }
});

export default authRouter;
