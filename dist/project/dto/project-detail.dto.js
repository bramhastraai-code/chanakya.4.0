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
exports.ProjectDetailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProjectDetailDto {
}
exports.ProjectDetailDto = ProjectDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'CSS class for custom styling' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'CSS class for custom styling' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "className", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the project' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "projectName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address of the project' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'List of property configurations',
    }),
    __metadata("design:type", Array)
], ProjectDetailDto.prototype, "PropertyConfig", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price of the project' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price per area' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "pricePerAre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL of the project thumbnail' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Listing ID for the project' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'List of project configurations',
    }),
    __metadata("design:type", Array)
], ProjectDetailDto.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude coordinate' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude coordinate' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "long", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'List of carpet area sizes' }),
    __metadata("design:type", Array)
], ProjectDetailDto.prototype, "carpetArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum price of the project' }),
    __metadata("design:type", Number)
], ProjectDetailDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum price of the project' }),
    __metadata("design:type", Number)
], ProjectDetailDto.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Information about the builder' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "builderInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "URL of the builder's logo" }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "builderLogoSrc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the builder' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "builderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the builder' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "builderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of projects' }),
    __metadata("design:type", Number)
], ProjectDetailDto.prototype, "totalProject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the project is ready to possess' }),
    __metadata("design:type", String)
], ProjectDetailDto.prototype, "readyToPossessDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CRM details of the project',
    }),
    __metadata("design:type", Object)
], ProjectDetailDto.prototype, "crmDetails", void 0);
//# sourceMappingURL=project-detail.dto.js.map