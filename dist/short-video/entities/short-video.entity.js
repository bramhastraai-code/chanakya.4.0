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
exports.ShortVideoSchema = exports.ShortVideo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_entity_1 = require("../../project/entities/project.entity");
const status_enum_1 = require("../../common/enum/status.enum");
let ShortVideo = class ShortVideo extends mongoose_2.Document {
};
exports.ShortVideo = ShortVideo;
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], ShortVideo.prototype, "videoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], ShortVideo.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], ShortVideo.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], ShortVideo.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "views", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "shares", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    }),
    __metadata("design:type", project_entity_1.Project)
], ShortVideo.prototype, "associatedProject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ShortVideo.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: status_enum_1.Status.IN_ACTIVE,
        enum: status_enum_1.Status,
    }),
    __metadata("design:type", String)
], ShortVideo.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ShortVideo.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ShortVideo.prototype, "updatedAt", void 0);
exports.ShortVideo = ShortVideo = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ShortVideo);
exports.ShortVideoSchema = mongoose_1.SchemaFactory.createForClass(ShortVideo);
exports.ShortVideoSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.ShortVideoSchema.index({ title: 'text', description: 'text' });
//# sourceMappingURL=short-video.entity.js.map