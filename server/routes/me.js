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
  validatePassword,
} from "../validators/helpers.js";
import updatePasswordRouteValidator from "../validators/updatePasswordValidator.js";
import { bioValidator } from "../validators/bioValidator.js";
import xss from "xss";
import { updateBio } from "../data/users.js";

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

    let updatedUser = {};
    try {
      if (req.body.firstName) {
        let firstName = xss(req.body.firstName);
        firstName = validateString(firstName, "firstName");
        updatedUser.firstName = firstName;
      }

      if (req.body.lastName) {
        let lastName = xss(req.body.lastName);
        lastName = validateString(lastName, "lastName");
        updatedUser.lastName = lastName;
      }

      if (req.body.dob) {
        let dob = xss(req.body.dob);
        dob = new Date(dob);
        dob = validateDOB(dob, "dob");
        updatedUser.dob = dob;
      }

      if (req.body.phoneNumber) {
        let phoneNumber = xss(req.body.phoneNumber);
        phoneNumber = validatePhone(phoneNumber, "phoneNumber");
        updatedUser.phoneNumber = phoneNumber;
      }

      if (req.body.gender) {
        let gender = xss(req.body.gender);
        gender = validateGender(gender, "gender");
        updatedUser.gender = gender;
      }

      updatedUser.email = req.currentUser.email;

      // if (sessionEmail != email)
      //   throw { status: 400, message: 'Email mismatch' };
    } catch (e) {
      return res.status(e.status).json({ error: e.message });
    }
    try {
      const userUpdated = await userData.updateUserProfile(updatedUser);
      return res.status(200).json({ user: userUpdated });
    } catch (e) {
      return e.status
        ? res.status(e.status).json({ error: e.message })
        : res.status(500).json({ error: "Internal server error" });
    }
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
      let { currentPassword, newPassword, confirmNewPassword } = req.body;
      let cleanCurrentPassword = xss(currentPassword);
      let cleanNewPassword = xss(newPassword);
      let cleanConfirmNewPassword = xss(confirmNewPassword);

      cleanCurrentPassword = validatePassword(
        currentPassword,
        "Current Password"
      );
      cleanNewPassword = validatePassword(newPassword, "New Password");

      if (cleanCurrentPassword === cleanNewPassword) {
        throw { status: 400, message: "New Password same as Current Password" };
      }

      if (cleanConfirmNewPassword !== cleanNewPassword) {
        throw { status: 400, message: "Passwords do not match" };
      }

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

router.route("/bio").patch(bioValidator, async (req, res) => {
  const { id } = req.currentUser;
  const { bio } = req.body;

  try {
    const user = await updateBio(id, bio);
    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ error: err.message || "Server error" });
  }
});

export default router;
