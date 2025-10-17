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
exports.BannerSchema = exports.Banner = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../../user/entity/user.entity");
let Banner = class Banner extends mongoose_2.Document {
};
exports.Banner = Banner;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Banner.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Banner.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Image', 'Video'], required: true }),
    __metadata("design:type", String)
], Banner.prototype, "contentType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Banner.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Banner.prototype, "videoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Banner.prototype, "imageUrlForMobile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Banner.prototype, "link", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Banner', 'Popup', 'Sidebar'], required: true }),
    __metadata("design:type", String)
], Banner.prototype, "adType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Banner.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Banner.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Banner.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Banner.prototype, "additionalInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ region: String, city: String, country: String }] }),
    __metadata("design:type", Array)
], Banner.prototype, "executionArea", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: [
            'RealEstate',
            'ElectricalAppliances',
            'ConstructionMaterials',
            'Services',
            'ProductRelatedToRealEstate',
        ],
        required: true,
    }),
    __metadata("design:type", String)
], Banner.prototype, "industrySegment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_entity_1.User.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Banner.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_entity_1.User.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Banner.prototype, "updatedBy", void 0);
exports.Banner = Banner = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Banner);
exports.BannerSchema = mongoose_1.SchemaFactory.createForClass(Banner);
//# sourceMappingURL=banner.entity.js.map