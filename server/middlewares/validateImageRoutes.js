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

      req.imageable = { record: user, imageableType, imageableId };
    }

    if (imageableType === "Home") {
      const home = await Home.findById(imageableId);

      if (!home) {
        return res
          .status(400)
          .send({ message: "Please provide a valid home id!" });
      }

      req.imageable = { record: home, imageableType, imageableId };
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default validateImageRoutes;
