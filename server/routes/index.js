import { authenticateRequest } from "../middlewares/index.js";
import authRoutes from "./auth.js";
import homiesRouter from "./homies.js";

const configureRoutes = (app) => {
  app.use("/api", authRoutes);
  app.use("/api/homies", authenticateRequest, homiesRouter);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found | at *" });
  });
};

export default configureRoutes;
