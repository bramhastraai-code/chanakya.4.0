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
exports.PropertySummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PropertySummaryDto {
}
exports.PropertySummaryDto = PropertySummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/thumbnail.jpg' }),
    __metadata("design:type", String)
], PropertySummaryDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Luxury Villa' }),
    __metadata("design:type", String)
], PropertySummaryDto.prototype, "propertyTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street, City, State' }),
    __metadata("design:type", String)
], PropertySummaryDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 250000 }),
    __metadata("design:type", Number)
], PropertySummaryDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Available' }),
    __metadata("design:type", String)
], PropertySummaryDto.prototype, "propertyStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500 }),
    __metadata("design:type", Number)
], PropertySummaryDto.prototype, "totalArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PropertySummaryDto.prototype, "bedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 166.67 }),
    __metadata("design:type", Number)
], PropertySummaryDto.prototype, "pricePerUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], PropertySummaryDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], PropertySummaryDto.prototype, "offers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PropertySummaryDto.prototype, "featured", void 0);
//# sourceMappingURL=recommondedProperty.dto.js.map