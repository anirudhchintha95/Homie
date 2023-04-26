import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Image } from "../models/index.js";

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
    let filename = file.key;

    if (!ImageService.s3Enabled()) {
      filename = file.filename;
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
        return url;
      })
    );

    return urls;
  }

  static async getImagesWithUrls(images, baseUrl) {
    if (ImageService.s3Enabled()) {
      return await ImageService.getImagePresignedUrls(images);
    } else {
      return images.map((image) => {
        return `${baseUrl}/${image.filename}`;
      });
    }
  }
}

export default ImageService;
