import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly uploadPath: string;

  constructor() {
    this.uploadPath = process.env.UPLOAD_PATH || 'uploads'; // Set your upload directory
  }

  // Ensure the upload directory exists
  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await fsPromises.mkdir(this.uploadPath, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException(
        'Could not create upload directory',
      );
    }
  }

  // Single file upload
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; filename: string }> {
    await this.ensureUploadDirectoryExists();

    const filename = `${file.originalname}`;
    const filePath = path.join(this.uploadPath, filename);

    try {
      await fsPromises.writeFile(filePath, file.buffer); // Save file to disk
      return { url: filePath, filename }; // Return the file path as the URL
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading file to local disk',
        error.message,
      );
    }
  }

  // Multiple files upload
  async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<{ url: string; filename: string }[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading multiple files to local disk',
        error.message,
      );
    }
  }

  // Delete file from disk
  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadPath, filename);

    try {
      await fsPromises.unlink(filePath); // Delete file from disk
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting file from local disk',
        error.message,
      );
    }
  }
}
