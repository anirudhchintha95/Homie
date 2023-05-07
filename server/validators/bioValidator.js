import { isValidEmail } from "./helpers.js";

export const bioValidator = (req, res, next) => {
  const { bio } = req.body;
  const { email } = req.body;

  if (typeof email !== "string" || !isValidEmail(email)) {
    throw { status: 400, message: "Email is invalid" };
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
