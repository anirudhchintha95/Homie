import { Router } from "express";
import { userData, homeData } from "../data/index.js";
import { authenticateRequest } from "../middlewares/index.js";

const router = Router();

router.route("/").get(async (req, res) => {
  const { email } = req.currentUser;
  try {
    const userDetails = await userData.getUserProfile(email);
    const homeDetails = await homeData.getHome(userDetails._id);
    userDetails["homes"] = homeDetails;
    return res.status(200).json({ user: userDetails });
  } catch (e) {
    return e[0]
      ? res.status(e[0]).json(e[1])
      : res.status(500).json("Internal server error");
  }
});

export default router;
