import { User } from "../models/index.js";
import JwtService from "../services/jwt-service.js";

const authenticateRequest = async (req, res, next) => {
  try {
    const { accesstoken } = req.headers;

    if (!accesstoken) {
      throw new Error("Unauthorised request");
    }

    const { _id, email } = await JwtService.decrypt(accesstoken);

    if (!_id || !email) {
      throw new Error("Unauthorised request");
    }
    req.currentUser = await User.findById(_id);

    if (req.currentUser.email !== email) {
      throw new Error("Unauthorised request");
    }
    next();
  } catch (e) {
    res.status(401).json({ error: "Unauthorised request" });
  }
};

export default authenticateRequest;
