import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import * as sharp from 'sharp';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  // Add watermark to the image buffer
  private async addWatermark(imageBuffer: Buffer): Promise<Buffer> {
    const watermarkText = 'Watermark'; // Change this to your desired watermark text

    const image = sharp(imageBuffer);
    const { width, height } = await image.metadata();

    const watermark = await sharp({
      create: {
        width: width || 200,
        height: height || 50,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    })
      .png()
      .composite([
        {
          input: Buffer.from(
            `<svg width="${width}" height="${height}">
              <text x="90%" y="90%" font-size="24" fill="rgba(255, 255, 255, 0.5)" text-anchor="end" dominant-baseline="bottom">${watermarkText}</text>
            </svg>`,
          ),
          gravity: 'southeast', // Position watermark at the bottom-right corner
        },
      ])
      .toBuffer();

    return image
      .composite([{ input: watermark, gravity: 'southeast' }])
      .toBuffer();
  }

  // Single file upload with watermark and folder
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; key: string }> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`;

    try {
      // Add watermark to the image
      const watermarkedBuffer = await this.addWatermark(file.buffer);

      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: watermarkedBuffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Make the file publicly accessible
      };

      const data = await this.s3.upload(params).promise();
      return { url: data.Location, key: data.Key };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading file to S3 with watermark',
        error.message,
      );
    }
  }

  // Multiple files upload with watermark and folder
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<{ url: string; key: string }[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading multiple files to S3 with watermark',
        error.message,
      );
    }
  }

  // Delete file from S3
  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw error;
    }
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; key: string }> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`;

    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype, // Ensure this matches the video MIME type
        ACL: 'public-read', // Make the file publicly accessible
      };

      const data = await this.s3.upload(params).promise();
      return { url: data.Location, key: data.Key };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading video to S3',
        error.message,
      );
    }
  }

  async uploadPDF(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; key: string }> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`;

    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype, // Ensure this matches the PDF MIME type
        ACL: 'public-read', // Make the file publicly accessible
      };

      const data = await this.s3.upload(params).promise();
      return { url: data.Location, key: data.Key };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading PDF to S3',
        error.message,
      );
    }
  }
}
