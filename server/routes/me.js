import { Router } from "express";
import { userData, homeData } from "../data/index.js";
import { protectedAccess } from "../middlewares/protectedAccess.js";

const router = Router();

router.route("/").get(async (req, res) => {
  const email = req.session.user.email;
  try {
    const userDetails = await userData.getUserProfile(email);
    const homeDetails = await homeData.getHome(userDetails._id);
    userDetails["homeInfo"] = homeDetails;
    return res.status(200).json(userDetails);
  } catch (e) {
    return e[0] != 500
      ? res.status(e[0]).json(e[1])
      : res.status(500).json("Internal server error");
  }
});

export default router;
