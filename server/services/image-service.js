import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Image } from "../models/index.js";
import { unlink } from "node:fs/promises";

class ImageService {
  static s3Enabled() {
    return (
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_S3_REGION &&
      process.env.AWS_S3_ACCESS_KEY_ID &&
      process.env.AWS_S3_SECRET_ACCESS_KEY
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

    // If an image is already created for this model, delete it

    const existingImages = await Image.find({
      imageableType,
      imageableId,
    });

    if (existingImages) {
      // await Image.deleteOne({ _id: existingImage._id });
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

  static async getPresignedUrl(key) {
    if (!ImageService.s3Enabled()) {
      throw { status: 500, message: "AWS S3 is not configured" };
    }

    if (!key) {
      throw { status: 400, message: "Missing key field for getting URL" };
    }

    const client = new S3Client({ region: process.env.AWS_S3_REGION });
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    return getSignedUrl(client, command, { expiresIn: 3600 });
  }

  static async getImagePresignedUrls(images) {
    if (!ImageService.s3Enabled()) {
      throw { status: 500, message: "AWS S3 is not configured" };
    }
    if (!images) return [];

    const urls = await Promise.all(
      images.map(async (image) => {
        const url = await ImageService.getPresignedUrl(image.filename);
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
      //TODO
    } else {
      for (let i in images) {
        const directoryPath = __basedir + "/uploads/";
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
    let imageIdList = images.map((image) => image.imageableId);
    const deletedImages = await Image.deleteMany({
      imageableId: { $in: imageIdList },
    });
    return deletedImages.deletedCount !== 0;
  }
}

export default ImageService;
