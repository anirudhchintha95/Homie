import User from "../models/user.js";
import { isValidEmail, isValidPassword } from "../validators/helpers.js";

export const getUserProfile = async (email) => {
  if (!isValidEmail(email)) throw [400, "Error: Invalid Email"];

  const userProfile = await User.findOne(
    { email: email },
    "-encryptedPassword -__v"
  );

  if (!userProfile) throw [404, "User not found"];

  userProfile._id = userProfile._id.toString();
  return userProfile._doc;
};
