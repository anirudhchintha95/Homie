import { Router } from "express";
import { userData, homeData } from "../data/index.js";
import { formatUserToResponse } from "../utils.js";
import ImageService from "../services/image-service.js";
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
import xss from "xss";

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    const { email } = req.currentUser;
    try {
      const userDetails = await userData.getUserProfile(email);
      const homeDetails = await homeData.getHomes(userDetails._id);
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
  })
  .patch(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    let { firstName, lastName, dob, phoneNumber, gender } = req.body;
    dob = xss(dob);
    dob = new Date(dob);
    const sessionEmail = req.currentUser.email;
    try {
      firstName = xss(firstName);
      lastName = xss(lastName);
      phoneNumber = xss(phoneNumber);
      gender = xss(gender);

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
    const userId = req.currentUser._id;
    try {
      const deletedUser = await userData.deleteUser(userId);
      const deletedHomes = await homeData.deleteHomes(userId);
      const userImages = await userData.getImages(userId);
      const homeImages = await homeData.getAllHomeImagesOfUser(userId);
      let allImages = userImages.concat(homeImages);
      const deletedImages = await ImageService.deleteImages(allImages);

      return res.status(200).json({ message: "Successfully deleted account" });
    } catch (e) {
      return res.status(500).json({ message: e });
    }
  });

router
  .route("/update-password")
  .patch(updatePasswordRouteValidator, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const cleanCurrentPassword = xss(currentPassword);
      const cleanNewPassword = xss(newPassword);

      const passwordUpdated = await userData.updatePassword(
        req.currentUser,
        cleanCurrentPassword,
        cleanNewPassword
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
