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
exports.FeaturedProjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FeaturedProjectDto {
}
exports.FeaturedProjectDto = FeaturedProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test project' }),
    __metadata("design:type", String)
], FeaturedProjectDto.prototype, "projectName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://example.com/thumbnail.jpg' }),
    __metadata("design:type", String)
], FeaturedProjectDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main St' }),
    __metadata("design:type", String)
], FeaturedProjectDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York' }),
    __metadata("design:type", String)
], FeaturedProjectDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NY' }),
    __metadata("design:type", String)
], FeaturedProjectDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20000 }),
    __metadata("design:type", Number)
], FeaturedProjectDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000000 }),
    __metadata("design:type", Number)
], FeaturedProjectDto.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['2bhk', '3bhk'] }),
    __metadata("design:type", Array)
], FeaturedProjectDto.prototype, "PropertyConfig", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '66cdb6dc992b64a2b23f4dd6' }),
    __metadata("design:type", String)
], FeaturedProjectDto.prototype, "builderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe Constructions' }),
    __metadata("design:type", String)
], FeaturedProjectDto.prototype, "builderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], FeaturedProjectDto.prototype, "totalProject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2022 }),
    __metadata("design:type", Number)
], FeaturedProjectDto.prototype, "since", void 0);
//# sourceMappingURL=featuredProject.dto.js.map