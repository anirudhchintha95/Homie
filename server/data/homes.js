import { isValidObjectId } from "mongoose";
import Home from "../models/home.js";
import Image from "../models/image.js";

export const getHomes = async (userId) => {
  if (!isValidObjectId(userId))
    throw { status: 400, message: "Error: Invaild User Id" };

  const home = await Home.find({ userId: userId }, "-__v");
  return home;
};

export const deleteHomes = async (userId) => {
  if (!isValidObjectId(userId))
    throw { status: 400, message: "Error: Invaild User Id" };
  const deletedHomes = await Home.deleteMany({ userId: userId });
  return deletedHomes.deletedCount !== 0;
};

export const getAllHomeImagesOfUser = async (userId) => {
  try {
    const homes = await getHomes(userId);
    const imagesArray = [];
    for (let home of homes) {
      let tempImageArray = await Image.find({
        imageableId: home._id,
        imageableType: "Home",
      });
      imagesArray.concat(tempImageArray);
    }
    return imagesArray;
  } catch (e) {
    throw e;
  }
};
