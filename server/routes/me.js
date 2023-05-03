import { Router } from "express";
import { userData, homeData } from "../data/index.js";
import { formatUserToResponse } from "../utils.js";
import {
  isValidEmail,
  isValidPassword,
  checkBoolean,
  validateNumber,
  validateNumberRange,
  validateString,
  validateId,
  validateDOB,
  validatePhone,
  validateGender,
} from "../validators/helpers.js";
import updatePasswordRouteValidator from "../validators/updatePasswordValidator.js";

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
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
  })
  .patch(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    let { firstName, lastName, dob, phoneNumber, gender } = req.body;
    dob = new Date(dob);
    const sessionEmail = req.currentUser.email;
    try {
      firstName = validateString(firstName, "firstName");
      lastName = validateString(lastName, "lastName");
      dob = validateDOB(dob, "dob");
      phoneNumber = validatePhone(phoneNumber, "phoneNumber");
      gender = validateGender(gender, "gender");
      // if (sessionEmail != email)
      //   throw { status: 400, message: 'Email mismatch' };
    } catch (e) {
      return res.status(e.status).json({ error: e.message });
    }
    try {
      const userUpdated = await userData.updateUserProfile(
        firstName,
        lastName,
        sessionEmail,
        dob,
        phoneNumber,
        gender
      );
      return res.status(200).json({ user: userUpdated });
    } catch (e) {}
  })
  .delete(async (req, res) => {
    const { email } = req.currentUser;
    try {
    } catch (e) {}
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
