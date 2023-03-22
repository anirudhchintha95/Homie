export const loginValidator = (email, password) => {
  // TODO: Do validations here
  console.log(email, password);
};

export const loginRouteValidator = (req, res, next) => {
  try {
    const { email, password } = req.body;
    loginValidator(email, password);
    next();
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
};
