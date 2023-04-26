import { Router } from "express";
import { homiesData } from "../data/index.js";

import linkedHomiesRouteValidator from "../validators/linkedHomiesValidator.js";
import { formatUserListResponse } from "../utils.js";

const homiesRouter = Router();

homiesRouter.route("/").post(async (req, res) => {
  try {
    const homies = await homiesData.getHomiesFuzzy(req.currentUser);
    res.json({ homies: await formatUserListResponse(req, homies) });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
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
      res.json({ homies: await formatUserListResponse(req, homies) });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  });

homiesRouter.route("/:id").get(async (req, res) => {
  try {
    let { id } = req.params;
    const user = await homiesData.getHomie(req.currentUser, id);
    res.json({ user });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

homiesRouter.route("/:id/send-message").post(async (req, res) => {
  try {
    let { id } = req.params;
    let { message } = req.body;
    const connection = await homiesData.sendMessage(
      req.currentUser,
      id,
      message
    );
    res.json({ connection });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

export default homiesRouter;
