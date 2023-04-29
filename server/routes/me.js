import { Router } from "express";
import { userData, homeData } from "../data/index.js";
import { formatUserToResponse } from "../utils.js";

const router = Router();

router.route("/").get(async (req, res) => {
  const { email } = req.currentUser;
  try {
    const userDetails = await userData.getUserProfile(email);
    const homeDetails = await homeData.getHome(userDetails._id);
    const images = await userData.getImages(userDetails._id);
    userDetails.homes = homeDetails;
    userDetails.images = images;
    return res
      .status(200)
      .json({ user: await formatUserToResponse(req, userDetails) });
  } catch (e) {
    return e.status
      ? res.status(e.status).json(e.message)
      : res.status(500).json("Internal server error");
  }
});

export default router;
