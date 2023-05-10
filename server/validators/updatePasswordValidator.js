import { validatePassword } from "./helpers.js";

export const updatePasswordValidator = ({ currentPassword, newPassword }) => {
  if (!currentPassword) {
    throw {
      status: 400,
      message: "Current password is required",
    };
  }

  if (!newPassword) {
    throw {
      status: 400,
      message: "New password is required",
    };
  }

  currentPassword = validatePassword(currentPassword, "Current password");
  newPassword = validatePassword(newPassword, "New password");

  return { currentPassword, newPassword };
};

const updatePasswordRouteValidator = (req, res, next) => {
  try {
    const { currentPassword, newPassword } = updatePasswordValidator(req.body);
    req.body.currentPassword = currentPassword;
    req.body.newPassword = newPassword;
    next();
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
};

export default updatePasswordRouteValidator;
