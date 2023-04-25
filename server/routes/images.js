import { Router } from "express";

import { Image } from "../models/index.js";
import ImageService from "../services/image-service.js";
import uploadFile from "../middlewares/uploadFile.js";

const imagesRouter = Router();

imagesRouter.route("/upload").post(uploadFile, async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    if (!req.imageable) {
      return res
        .status(400)
        .send({ message: "Could not find the model to assign this image to." });
    }

    const image = await ImageService.createImage({
      file: req.file,
      imageableType: req.imageable.imageableType,
      imageableId: req.imageable.imageableId,
    });

    if (!image) {
      return res.status(400).send({ message: "Could not save image" });
    }

    return res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
      location: image.url,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

imagesRouter.route("/download/:filename").get(async (req, res) => {
  try {
    const { filename } = req.params;

    if (!req.imageable) {
      return res
        .status(400)
        .send({ message: "Could not find the model this image is assigned to." });
    }
    const imageFile = await Image.findOne({
      filename,
      imageableType: req.imageable.imageableType,
      imageableId: req.imageable.imageableId,
    });

    if (!imageFile) {
      return res.status(400).send({ message: "Could not find image" });
    }

    const directoryPath = __basedir + "/uploads/";

    res.download(directoryPath + filename, filename, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
});

export default imagesRouter;
