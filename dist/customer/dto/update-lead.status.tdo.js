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
exports.UpdateLeadStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const usertype_enum_1 = require("../enum/usertype.enum");
class UpdateLeadStatusDto {
}
exports.UpdateLeadStatusDto = UpdateLeadStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: usertype_enum_1.LeadStatus,
        example: usertype_enum_1.LeadStatus.QUALIFIED,
        description: 'New status for the lead',
    }),
    (0, class_validator_1.IsEnum)(usertype_enum_1.LeadStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateLeadStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Optional notes about the status change',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLeadStatusDto.prototype, "notes", void 0);
//# sourceMappingURL=update-lead.status.tdo.js.map