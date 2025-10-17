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
exports.AgentInquirySchema = exports.AgentInquiry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AgentInquiry = class AgentInquiry extends mongoose_2.Document {
};
exports.AgentInquiry = AgentInquiry;
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], AgentInquiry.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], AgentInquiry.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AgentInquiry.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AgentInquiry.prototype, "YearOfExperience", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AgentInquiry.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AgentInquiry.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AgentInquiry.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AgentInquiry.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AgentInquiry.prototype, "pinCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'PENDING' }),
    __metadata("design:type", String)
], AgentInquiry.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AgentInquiry.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AgentInquiry.prototype, "updatedAt", void 0);
exports.AgentInquiry = AgentInquiry = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AgentInquiry);
exports.AgentInquirySchema = mongoose_1.SchemaFactory.createForClass(AgentInquiry);
//# sourceMappingURL=agent-inquiry.entity.js.map