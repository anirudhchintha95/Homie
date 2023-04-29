import Image from "../models/image.js";
import User from "../models/user.js";
import { isValidEmail } from "../validators/helpers.js";

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
