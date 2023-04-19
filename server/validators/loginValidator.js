import { isValidEmail, isValidPassword } from "./helpers.js";

export const loginValidator = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isValid = isValidEmail(email) && isValidPassword(password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    next();
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};
