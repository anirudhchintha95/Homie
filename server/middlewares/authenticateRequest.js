import User from "../models/user";

const authenticateRequest = async (req, res, next) => {
  try {
    req.currentUser = await User.find({ email: "john.doe@gmail.com" });
    next();
  } catch (e) {
    res.status(401).json({ error: "Unauthorised request" });
  }
};

export default authenticateRequest;
