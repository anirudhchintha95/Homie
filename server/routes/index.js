import {
  authenticateRequest,
  validateImageRoutes,
} from "../middlewares/index.js";

import authRoutes from "./auth.js";
import homiesRouter from "./homies.js";
import imagesRouter from "./images.js";
import profileRoutes from "./me.js";
import preferenceRoutes from "./preferences.js";

const configureRoutes = (app) => {
  app.use("/api", authRoutes);
  app.use("/api/images", imagesRouter);
  app.use("/api/homies", authenticateRequest, homiesRouter);
  app.use("/api/me", authenticateRequest, profileRoutes);
  app.use("/api/preferences", preferenceRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found | at *" });
  });
};

export default configureRoutes;
