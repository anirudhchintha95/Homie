import { isValidObjectId } from "mongoose";

export const addFavoriteValidator = (req, res, next) => {
  const { id } = req.params;
  const user = req.currentUser;

  if (!id || !user) {
    return res.status(400).json({ error: "Error: Invalid request" });
  }

  if (!isValidObjectId(id) || !isValidObjectId(user._id.toString())) {
    return res.status(400).json({ error: "Error: Invalid user ID" });
  }

  next();
};
