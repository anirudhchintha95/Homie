import { CONNECTION_TYPES } from "../constants.js";
import xss from "xss";

export const validateLinkedHomiesBody = ({ connectionType, search }) => {
  if (!connectionType) {
    throw {
      status: 400,
      message: "Missing connectionType",
    };
  }

  connectionType = xss(connectionType?.trim()) || "";
  search = xss(search?.trim()) || "";

  if (!connectionType) {
    throw {
      status: 400,
      message: "Missing connectionType",
    };
  }

  if (!Object.values(CONNECTION_TYPES).includes(connectionType)) {
    throw {
      status: 400,
      message: "Invalid connectionType",
    };
  }

  return { connectionType, search };
};

const linkedHomiesRouteValidator = (req, res, next) => {
  try {
    const { connectionType, search } = validateLinkedHomiesBody(req.body);
    req.body.connectionType = connectionType;
    req.body.search = search;
    next();
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
};

export default linkedHomiesRouteValidator;
