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
exports.CreateBlogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBlogDto {
}
exports.CreateBlogDto = CreateBlogDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the blog',
        example: 'Understanding NestJS Modules',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of the blog',
        example: 'NestJS modules are used to organize the application...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the blog',
        example: 'This blog post covers the basics of NestJS modules.',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SEO-friendly slug for the blog',
        example: 'understanding-nestjs-modules',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional cover image URL for the blog',
        example: 'https://example.com/images/cover.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category of the blog',
        example: 'Technology',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SEO title for the blog',
        example: 'Learn NestJS Modules in Depth',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "seoTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SEO description for the blog',
        example: 'A comprehensive guide to NestJS modules and their usage.',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "seoDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SEO keywords for the blog',
        example: ['NestJS', 'Modules', 'Backend Development'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateBlogDto.prototype, "seoKeywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Author ID (MongoDB ObjectId)',
        example: '64f7a5e899b3c25b4d2df456',
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "authorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created by user ID (MongoDB ObjectId)',
        example: '64f7a5e899b3c25b4d2df456',
        required: false,
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the blog',
        example: 'active',
        enum: ['active', 'inactive'],
        default: 'active',
    }),
    (0, class_validator_1.IsEnum)(['active', 'inactive']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated by user ID (MongoDB ObjectId)',
        example: '64f7a5e899b3c25b4d2df456',
        required: false,
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "updatedBy", void 0);
//# sourceMappingURL=create-blog.dto.js.map