import { isValidObjectId } from "mongoose";
import Home from "../models/home.js";

export const getHome = async (userId) => {
  if (!isValidObjectId(userId))
    throw { status: 400, message: "Error: Invaild User Id" };

  const home = await Home.find({ userId: userId }, "-__v");
  return home;
};

export const deleteHome = async (userId) => {
  const deletedHomes = await Home.deleteMany({ userId: userId });
  return deletedHomes.deletedCount !== 0;
};
