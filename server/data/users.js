import Image from "../models/image.js";
import User from "../models/user.js";
import PasswordService from "../services/password-service.js";
import { isValidEmail } from "../validators/helpers.js";
import { updatePasswordValidator } from "../validators/updatePasswordValidator.js";

export const getUserProfile = async (email) => {
  if (!isValidEmail(email))
    throw { status: 400, message: "Error: Invalid Email" };

  const userProfile = await User.findOne(
    { email: email },
    "-encryptedPassword -__v"
  );

  if (!userProfile) throw { status: 404, message: "User not found" };

  userProfile._id = userProfile._id.toString();
  return userProfile._doc;
};

export const getImages = async (currentUser) => {
  if (!currentUser) throw { status: 401, message: "Unauthorized" };

  const images = await Image.find({
    imageableId: currentUser._id,
    imageableType: "User",
  });

  return images;
};

export const updatePassword = async (
  currentUser,
  currentPassword,
  newPassword
) => {
  if (!currentUser) throw { status: 401, message: "Unauthorized" };

  const passwordsAfterValidation = updatePasswordValidator({
    currentPassword,
    newPassword,
  });
  currentPassword = passwordsAfterValidation.currentPassword;
  newPassword = passwordsAfterValidation.newPassword;

  if (!(await currentUser.verifyPassword(currentPassword))) {
    throw { status: 400, message: "Incorrect password" };
  }

  if (currentPassword === newPassword) {
    throw {
      status: 400,
      message: "New password cannot be same as old password",
    };
  }

  const encryptedPassword = await new PasswordService(newPassword).encrypt();

  const result = await User.updateOne(
    { _id: currentUser._id },
    { encryptedPassword }
  );

  return result.acknowledged && result.modifiedCount !== 0;
};
