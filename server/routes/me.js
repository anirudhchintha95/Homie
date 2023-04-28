import { Router } from "express";
import { userData, homeData } from "../data/index.js";

const router = Router();

router.route("/").get(async (req, res) => {
  const { email } = req.currentUser;
  try {
    const userDetails = await userData.getUserProfile(email);
    const homeDetails = await homeData.getHome(userDetails._id);
    userDetails["homes"] = homeDetails;
    return res.status(200).json({ user: userDetails });
  } catch (e) {
    return e.status
      ? res.status(e.status).json(e.message)
      : res.status(500).json("Internal server error");
  }
});

export default router;
