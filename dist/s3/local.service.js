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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path = require("path");
let FileService = class FileService {
    constructor() {
        this.uploadPath = process.env.UPLOAD_PATH || 'uploads';
    }
    async ensureUploadDirectoryExists() {
        try {
            await fs_1.promises.mkdir(this.uploadPath, { recursive: true });
        }
        catch (error) {
            throw error;
        }
    }
    async uploadFile(file) {
        await this.ensureUploadDirectoryExists();
        const filename = `${file.originalname}`;
        const filePath = path.join(this.uploadPath, filename);
        try {
            await fs_1.promises.writeFile(filePath, file.buffer);
            return { url: filePath, filename };
        }
        catch (error) {
            throw error;
        }
    }
    async uploadFiles(files) {
        const uploadPromises = files.map((file) => this.uploadFile(file));
        try {
            return await Promise.all(uploadPromises);
        }
        catch (error) {
            throw error;
        }
    }
    async deleteFile(filename) {
        const filePath = path.join(this.uploadPath, filename);
        try {
            await fs_1.promises.unlink(filePath);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileService);
//# sourceMappingURL=local.service.js.map