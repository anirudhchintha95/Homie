import authRoutes from "./auth.js";

const configureRoutes = (app) => {
  app.use("/api", authRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found | at *" });
  });
};

export default configureRoutes;
