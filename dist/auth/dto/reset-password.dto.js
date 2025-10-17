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
exports.AdminResetPasswordDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AdminResetPasswordDto {
}
exports.AdminResetPasswordDto = AdminResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the user whose password will be reset',
        type: String,
    }),
    (0, class_validator_1.IsString)({ message: 'User ID must be a valid MongoDB ObjectId' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'User ID cannot be empty' }),
    __metadata("design:type", String)
], AdminResetPasswordDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The new password to set for the user',
        type: String,
    }),
    (0, class_validator_1.IsString)({ message: 'New password must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'New password cannot be empty' }),
    __metadata("design:type", String)
], AdminResetPasswordDto.prototype, "newPassword", void 0);
//# sourceMappingURL=reset-password.dto.js.map