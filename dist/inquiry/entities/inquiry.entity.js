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
exports.InquirySchema = exports.Inquiry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Inquiry = class Inquiry extends mongoose_2.Document {
};
exports.Inquiry = Inquiry;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inquiry.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inquiry.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inquiry.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inquiry.prototype, "companyname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Inquiry.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['common', 'groupBuy', 'agentSelection', 'quickBuy', 'siteVisit'],
        default: 'common',
    }),
    __metadata("design:type", String)
], Inquiry.prototype, "inquiryType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Inquiry.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Property', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Inquiry.prototype, "propertyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Inquiry.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Inquiry.prototype, "about", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: false, default: null }),
    __metadata("design:type", Date)
], Inquiry.prototype, "siteVisitDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false, default: null }),
    __metadata("design:type", String)
], Inquiry.prototype, "siteVisitTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'PENDING',
    }),
    __metadata("design:type", String)
], Inquiry.prototype, "status", void 0);
exports.Inquiry = Inquiry = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Inquiry);
exports.InquirySchema = mongoose_1.SchemaFactory.createForClass(Inquiry);
//# sourceMappingURL=inquiry.entity.js.map