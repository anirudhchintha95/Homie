import { Router } from "express";
import { userData, homeData } from "../data/index.js";
import { formatUserToResponse } from "../utils.js";
import updatePasswordRouteValidator from "../validators/updatePasswordValidator.js";

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
      ? res.status(e.status).json({ error: e.message })
      : res.status(500).json({ error: "Internal server error" });
  }
});

router
  .route("/update-password")
  .patch(updatePasswordRouteValidator, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const passwordUpdated = await userData.updatePassword(
        req.currentUser,
        currentPassword,
        newPassword
      );

      if (!passwordUpdated) {
        return res.status(400).json({ message: "Could not update password" });
      }

      return res.status(200).json({ message: "Password updated" });
    } catch (e) {
      return e.status
        ? res.status(e.status).json({ error: e.message })
        : res.status(500).json({ error: "Internal server error" });
    }
  });

export default router;
