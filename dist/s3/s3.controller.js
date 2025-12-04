"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var S3Controller_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Controller = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("./s3.service");
const swagger_1 = require("@nestjs/swagger");
const uploadfile_s3_dto_1 = require("./dto/uploadfile.s3.dto");
const UploadFiles_s3_dto_1 = require("./dto/UploadFiles.s3.dto");
const common_2 = require("@nestjs/common");
let S3Controller = S3Controller_1 = class S3Controller {
    constructor(s3Service) {
        this.s3Service = s3Service;
        this.logger = new common_2.Logger(S3Controller_1.name);
    }
    async uploadFile(file, uploadFileDto) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const data = await this.s3Service.uploadFile(file, uploadFileDto.folder);
        return { data, message: 'Image uploaded successfully' };
    }
    async uploadFiles(files, uploadFilesDto) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Files are required');
        }
        const data = await this.s3Service.uploadFiles(files, uploadFilesDto.folder);
        return { data, message: 'Uploaded multiple images successfully' };
    }
    async deleteFile(key) {
        this.logger.log(`Deleting file with key: ${key}`);
        const data = await this.s3Service.deleteFile(key);
        return { data, message: 'File deleted successfully' };
    }
    async uploadVideo(file, folder) {
        if (!file) {
            throw new Error('File is required for upload.');
        }
        const data = await this.s3Service.uploadVideo(file, folder);
        return { data, message: 'Uploaded multiple images successfully' };
    }
    async uploadPDF(file, folder) {
        if (!file) {
            throw new common_1.BadRequestException('File is required for upload.');
        }
        const data = await this.s3Service.uploadPDF(file, folder);
        return { data, message: 'PDF uploaded successfully' };
    }
};
exports.S3Controller = S3Controller;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload a single file to S3 with watermark',
        description: 'Uploads a single file to S3 and adds a watermark to it. The file is publicly accessible.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The file has been successfully uploaded to S3 with a watermark.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - The file is required and must be a valid image.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, uploadfile_s3_dto_1.UploadFileDto]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload/multiple'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload multiple files to S3 with watermarks',
        description: 'Uploads multiple files to S3 and adds a watermark to each. The files are publicly accessible.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The files have been successfully uploaded to S3 with watermarks.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - At least one file is required and each must be a valid image.',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, UploadFiles_s3_dto_1.UploadFilesDto]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Delete)('s3-delete/:key(*)'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a file from S3',
        description: 'Deletes a file from S3 based on the provided key.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'key',
        description: 'S3 file key (e.g., documents/filename.jpg)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'The file has been successfully deleted from S3.',
    }),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Post)('upload-video'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a video file to S3' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Video uploaded successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Upload failed',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Post)('upload-pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a PDF file to S3' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'PDF uploaded successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Upload failed',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "uploadPDF", null);
exports.S3Controller = S3Controller = S3Controller_1 = __decorate([
    (0, swagger_1.ApiTags)('S3'),
    (0, common_1.Controller)('s3'),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], S3Controller);
//# sourceMappingURL=s3.controller.js.map