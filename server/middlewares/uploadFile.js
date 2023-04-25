import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import fs from "fs";

import * as dotenv from "dotenv";
import ImageService from "../services/image-service.js";
dotenv.config();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // create uploads folder if it doesn't exist
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + "-" + file.originalname);
  },
});

if (ImageService.s3Enabled()) {
  const s3 = new S3Client({ region: process.env.AWS_S3_REGION });

  storage = multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  });
}

const uploadFile = multer({ storage }).single("image");

export default uploadFile;
