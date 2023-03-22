import authRoutes from "./auth.js";

const configureRoutes = (app) => {
  app.use("/api", authRoutes);

  app.use("*", (_, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configureRoutes;
