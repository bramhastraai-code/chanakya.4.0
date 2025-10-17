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
exports.VideoSchema = exports.Video = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_enum_1 = require("../enums/video.enum");
let Video = class Video extends mongoose_2.Document {
};
exports.Video = Video;
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Customer' }),
    __metadata("design:type", String)
], Video.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Video.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Video.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: video_enum_1.VideoSourceType, required: true }),
    __metadata("design:type", String)
], Video.prototype, "sourceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: function () {
            return this.sourceType === video_enum_1.VideoSourceType.S3;
        },
    }),
    __metadata("design:type", String)
], Video.prototype, "s3Key", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: function () {
            return this.sourceType === video_enum_1.VideoSourceType.YOUTUBE;
        },
    }),
    __metadata("design:type", String)
], Video.prototype, "youtubeUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: video_enum_1.VideoStatus, default: video_enum_1.VideoStatus.PENDING }),
    __metadata("design:type", String)
], Video.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Video.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Video.prototype, "rejectedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Video.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Video.prototype, "earnings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Project' }),
    __metadata("design:type", String)
], Video.prototype, "projectId", void 0);
exports.Video = Video = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Video);
exports.VideoSchema = mongoose_1.SchemaFactory.createForClass(Video);
//# sourceMappingURL=video.entity.js.map