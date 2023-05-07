import { isValidObjectId } from "mongoose";

export const bioValidator = (req, res, next) => {
  const { bio } = req.body;
  const { id } = req.currentUser;

  if (!id || !bio) {
    return res.status(400).json({ error: "Error: Invalid request" });
  }

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Error: Invalid user ID" });
  }

  if (typeof bio !== "string") {
    return res.status(400).json({ error: "Bio must be a string" });
  }

  const trimmedBio = bio.trim();

  if (trimmedBio.length === 0) {
    return res.status(400).json({ error: "Bio is required" });
  }

  if (trimmedBio.length > 250) {
    return res
      .status(400)
      .json({ error: "Bio must be less than 250 characters" });
  }

  req.body.bio = trimmedBio;

  next();
};
