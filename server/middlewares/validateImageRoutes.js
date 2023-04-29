import { Home, User } from "../models/index.js";

const validateImageRoutes = async (req, res, next) => {
  try {
    const { imageableType, imageableId } = req.params;

    if (imageableType === undefined || imageableId === undefined) {
      return res
        .status(400)
        .send({ message: "Please provide a imageableType and id!" });
    }

    if (imageableType !== "User" && imageableType !== "Home") {
      return res
        .status(400)
        .send({ message: "Please provide a valid imageableType!" });
    }

    if (imageableType === "User") {
      const user = await User.findById(imageableId);

      if (!user) {
        return res
          .status(400)
          .send({ message: "Please provide a valid user id!" });
      }

      if (user._id.toString() !== req.currentUser._id.toString()) {
        return res.status(403).send({
          message: "You are not authorized to upload images for this user!",
        });
      }

      req.imageable = { record: user, imageableType, imageableId: user._id };
    }

    if (imageableType === "Home") {
      const home = await Home.findById(imageableId);

      if (!home) {
        return res
          .status(400)
          .send({ message: "Please provide a valid home id!" });
      }

      if (home.userId.toString() !== req.currentUser._id.toString()) {
        return res.status(403).send({
          message: "You are not authorized to upload images for this home!",
        });
      }

      req.imageable = { record: home, imageableType, imageableId: home._id };
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const downloadImageRoutes = async (req, res, next) => {
  try {
    const { imageableType, imageableId } = req.params;

    if (imageableType === undefined || imageableId === undefined) {
      return res
        .status(400)
        .send({ message: "Please provide a imageableType and id!" });
    }

    if (imageableType !== "User" && imageableType !== "Home") {
      return res
        .status(400)
        .send({ message: "Please provide a valid imageableType!" });
    }

    if (imageableType === "User") {
      const user = await User.findById(imageableId);

      if (!user) {
        return res
          .status(400)
          .send({ message: "Please provide a valid user id!" });
      }

      req.imageable = { record: user, imageableType, imageableId: user._id };
    }

    if (imageableType === "Home") {
      const home = await Home.findById(imageableId);

      if (!home) {
        return res
          .status(400)
          .send({ message: "Please provide a valid home id!" });
      }

      req.imageable = { record: home, imageableType, imageableId: home._id };
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default validateImageRoutes;
