import { Router } from "express";
import { homiesData } from "../data/index.js";

const homiesRouter = Router();

homiesRouter.route("/").post(async (req, res) => {
  try {
    const homies = await homiesData.getHomiesFuzzy(req.currentUser);
    res.json({ homies });
  } catch (error) {
    return res.status(error.status).json({ error: error.message });
  }
});

export default homiesRouter;
