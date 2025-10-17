import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  Delete,
  Param,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import {
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/uploadfile.s3.dto';
import { UploadFilesDto } from './dto/UploadFiles.s3.dto';
import { Response } from 'src/common/interceptor/response.interface';

@ApiTags('S3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a single file to S3 with watermark',
    description:
      'Uploads a single file to S3 and adds a watermark to it. The file is publicly accessible.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description:
      'The file has been successfully uploaded to S3 with a watermark.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - The file is required and must be a valid image.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          example: 'documents',
          description: 'The folder where the PDF will be uploaded',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'The Image file to upload',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<Response<{ url: string; key: string }>> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const data = await this.s3Service.uploadFile(file, uploadFileDto.folder);
    return { data, message: 'Image uploaded successfully' };
  }

  @Post('upload/multiple')
  @ApiOperation({
    summary: 'Upload multiple files to S3 with watermarks',
    description:
      'Uploads multiple files to S3 and adds a watermark to each. The files are publicly accessible.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description:
      'The files have been successfully uploaded to S3 with watermarks.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - At least one file is required and each must be a valid image.',
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadFilesDto: UploadFilesDto,
  ): Promise<Response<{ url: string; key: string }[]>> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    const data = await this.s3Service.uploadFiles(files, uploadFilesDto.folder);
    return { data, message: 'Uploaded multiple images successfully' };
  }

  @Delete(':key')
  @ApiOperation({
    summary: 'Delete a file from S3',
    description: 'Deletes a file from S3 based on the provided key.',
  })
  @ApiParam({ name: 'key', description: 'S3 file key' })
  @ApiResponse({
    status: 204,
    description: 'The file has been successfully deleted from S3.',
  })
  @HttpCode(204)
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteFile(key);
  }
  @Post('upload-video')
  @ApiOperation({ summary: 'Upload a video file to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          example: 'videos',
          description: 'The folder where the video will be uploaded',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'The video file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Video uploaded successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Upload failed',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    if (!file) {
      throw new Error('File is required for upload.');
    }

    const data = await this.s3Service.uploadVideo(file, folder);
    return { data, message: 'Uploaded multiple images successfully' };
  }

  @Post('upload-pdf')
  @ApiOperation({ summary: 'Upload a PDF file to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          example: 'documents',
          description: 'The folder where the PDF will be uploaded',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'The PDF file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'PDF uploaded successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Upload failed',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ): Promise<Response<{ url: string; key: string }>> {
    if (!file) {
      throw new BadRequestException('File is required for upload.');
    }

    const data = await this.s3Service.uploadPDF(file, folder);
    return { data, message: 'PDF uploaded successfully' };
  }
}
