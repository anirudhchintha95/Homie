import User from "../models/user.js";
import { isValidEmail, isValidPassword } from "../validators/helpers.js";
import { ObjectId, isValidObjectId } from "mongoose";
import Home from "../models/home.js";

export const getHome = async (userId) => {
  if (!isValidObjectId(userId)) throw [400, "Error: Invaild User Id"];

  const home = await Home.findOne({ userId: userId }, "-_id -__v");

  return home._doc;
};
