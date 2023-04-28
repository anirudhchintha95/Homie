import { isValidObjectId } from "mongoose";
import Home from "../models/home.js";

export const getHome = async (userId) => {
  if (!isValidObjectId(userId)) throw { status: 400, message: "Error: Invaild User Id" };

  const home = await Home.find({ userId: userId }, "-__v");
  return home;
};
