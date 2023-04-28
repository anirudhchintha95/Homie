export const signupValidator = (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw { status: 400, message: "Email must be a non-empty string" };
    }

    if (!password) {
      throw { status: 400, message: "Password must be a non-empty string" };
    }

    if (password.length < 8) {
      throw {
        status: 400,
        message: "Password must be a non-empty string of length 8",
      };
    }
    next();
  } catch (error) {
    if (error.status === 400) {
      return res.status(error.status).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};
