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
exports.HandleBrokerConnectionDto = exports.BrokerConnectionRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class BrokerConnectionRequestDto {
}
exports.BrokerConnectionRequestDto = BrokerConnectionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the broker',
        example: '12345',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BrokerConnectionRequestDto.prototype, "brokerId", void 0);
class HandleBrokerConnectionDto {
}
exports.HandleBrokerConnectionDto = HandleBrokerConnectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the broker',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleBrokerConnectionDto.prototype, "brokerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The action to perform on the broker connection',
        enum: ['accept', 'reject'],
        example: 'accept',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['accept', 'reject'], {
        message: 'Action must be either "accept" or "reject"',
    }),
    __metadata("design:type", String)
], HandleBrokerConnectionDto.prototype, "action", void 0);
//# sourceMappingURL=handleConnection.dto.js.map