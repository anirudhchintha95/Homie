import { Router } from "express";
import { homiesData } from "../data/index.js";

import linkedHomiesRouteValidator from "../validators/linkedHomiesValidator.js";

const homiesRouter = Router();

homiesRouter.route("/").post(async (req, res) => {
  try {
    const homies = await homiesData.getHomiesFuzzy(req.currentUser);
    res.json({ homies });
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
});

homiesRouter
  .route("/linked")
  .post(linkedHomiesRouteValidator, async (req, res) => {
    try {
      let { connectionType, search } = req.body;
      const homies = await homiesData.getLinkedHomies(
        req.currentUser,
        connectionType,
        search
      );
      res.json({ homies });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  });

export default homiesRouter;
