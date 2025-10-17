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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const uuid_1 = require("uuid");
const sharp = require("sharp");
let S3Service = class S3Service {
    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    }
    async addWatermark(imageBuffer) {
        const watermarkText = 'Watermark';
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
                input: Buffer.from(`<svg width="${width}" height="${height}">
              <text x="90%" y="90%" font-size="24" fill="rgba(255, 255, 255, 0.5)" text-anchor="end" dominant-baseline="bottom">${watermarkText}</text>
            </svg>`),
                gravity: 'southeast',
            },
        ])
            .toBuffer();
        return image
            .composite([{ input: watermark, gravity: 'southeast' }])
            .toBuffer();
    }
    async uploadFile(file, folder) {
        const key = `${folder}/${(0, uuid_1.v4)()}-${file.originalname}`;
        try {
            const watermarkedBuffer = await this.addWatermark(file.buffer);
            const params = {
                Bucket: this.bucketName,
                Key: key,
                Body: watermarkedBuffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };
            const data = await this.s3.upload(params).promise();
            return { url: data.Location, key: data.Key };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error uploading file to S3 with watermark', error.message);
        }
    }
    async uploadFiles(files, folder) {
        const uploadPromises = files.map((file) => this.uploadFile(file, folder));
        try {
            return await Promise.all(uploadPromises);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error uploading multiple files to S3 with watermark', error.message);
        }
    }
    async deleteFile(key) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };
        try {
            await this.s3.deleteObject(params).promise();
        }
        catch (error) {
            throw error;
        }
    }
    async uploadVideo(file, folder) {
        const key = `${folder}/${(0, uuid_1.v4)()}-${file.originalname}`;
        try {
            const params = {
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };
            const data = await this.s3.upload(params).promise();
            return { url: data.Location, key: data.Key };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error uploading video to S3', error.message);
        }
    }
    async uploadPDF(file, folder) {
        const key = `${folder}/${(0, uuid_1.v4)()}-${file.originalname}`;
        try {
            const params = {
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };
            const data = await this.s3.upload(params).promise();
            return { url: data.Location, key: data.Key };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error uploading PDF to S3', error.message);
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3Service);
//# sourceMappingURL=s3.service.js.map