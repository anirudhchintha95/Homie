import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Image } from "../models/index.js";
import { unlink } from "node:fs/promises";

let _s3_client;

class S3Service {
  constructor() {
    this.client = S3Service.getS3Client();
  }

  static getS3Client() {
    if (!_s3_client) {
      _s3_client = new S3Client({ region: process.env.AWS_S3_REGION });
    }
    return _s3_client;
  }

  async getPresignedUrl(key) {
    if (!key) {
      throw { status: 400, message: "Missing key field for getting URL" };
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    try {
      return getSignedUrl(this.client, command, { expiresIn: 3600 });
    } catch (e) {
      console.log({ status: 400, message: "Could not get presigned URL" });
      return;
    }
  }

  async deleteObject(key) {
    if (!key) {
      throw { status: 400, message: "Missing key field for deleting object" };
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    try {
      return await this.client.send(command);
    } catch (e) {
      console.log({ status: 400, message: "Could not delete object" });
      return;
    }
  }
}

class ImageService {
  static s3Enabled() {
    return (
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_S3_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
    );
  }

  static async createImage({ file, imageableType, imageableId }) {
    if (!file || !imageableType || !imageableId) {
      throw { status: 400, message: "Missing required fields" };
    }

    let filename = file.key;

    if (!ImageService.s3Enabled()) {
      filename = file.filename;
    }

    const existingImages = await Image.aggregate([
      {
        $match: {
          imageableType,
          imageableId,
        },
      },
    ]);

    if (existingImages) {
      await ImageService.deleteImages(existingImages);
    }

    const image = await Image.create({
      name: file.originalname,
      filename,
      type: file.mimetype,
      imageableId,
      imageableType,
    });

    if (!image) {
      throw { status: 400, message: "Could not save image" };
    }

    return image;
  }

  static async getImagePresignedUrls(images) {
    if (!ImageService.s3Enabled()) {
      throw { status: 500, message: "AWS S3 is not configured" };
    }
    if (!images) return [];

    const urls = await Promise.all(
      images.map(async (image) => {
        const url = await new S3Service().getPresignedUrl(image.filename);
        return { url, ...image };
      })
    );

    return urls;
  }

  static async getImagesWithUrls(images, baseUrl) {
    if (!baseUrl) {
      throw { status: 400, message: "Missing base URL" };
    }

    if (!images) return [];

    if (ImageService.s3Enabled()) {
      return await ImageService.getImagePresignedUrls(images);
    } else {
      return images.map((image) => {
        return {
          ...image,
          url: `${baseUrl}/${image._id}`,
        };
      });
    }
  }

  static async deleteImages(images) {
    if (!images) return [];

    if (ImageService.s3Enabled()) {
      for (let image of images) {
        await new S3Service().deleteObject(image.filename);
      }
    } else {
      const directoryPath = __basedir + "/uploads/";
      for (let i of images) {
        const { filename } = i;
        const imagePath = directoryPath + filename;
        try {
          //Refer unlink docs
          await unlink(imagePath);
        } catch (e) {
          console.log({ status: 400, message: e });
        }
      }
    }
    let imageIdList = images.map((image) => image._id);
    const deletedImages = await Image.deleteMany({
      _id: { $in: imageIdList },
    });
    return deletedImages.deletedCount !== 0;
  }
}

export default ImageService;
