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
exports.UserBehaviorSchema = exports.UserBehavior = exports.UserBehaviorType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var UserBehaviorType;
(function (UserBehaviorType) {
    UserBehaviorType["PAGE_VIEW"] = "page_view";
    UserBehaviorType["CTA_CLICK"] = "cta_click";
})(UserBehaviorType || (exports.UserBehaviorType = UserBehaviorType = {}));
let UserBehavior = class UserBehavior extends mongoose_2.Document {
};
exports.UserBehavior = UserBehavior;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Customer' }),
    __metadata("design:type", Object)
], UserBehavior.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, enum: ['new', 'old'], default: 'old' }),
    __metadata("design:type", String)
], UserBehavior.prototype, "userType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], UserBehavior.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserBehavior.prototype, "fcmToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, enum: UserBehaviorType }),
    __metadata("design:type", String)
], UserBehavior.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], UserBehavior.prototype, "pageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserBehavior.prototype, "pageTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], UserBehavior.prototype, "section", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserBehavior.prototype, "referrer", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserBehavior.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], UserBehavior.prototype, "deviceInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserBehavior.prototype, "ctaId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserBehavior.prototype, "ctaType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserBehavior.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], UserBehavior.prototype, "metadata", void 0);
exports.UserBehavior = UserBehavior = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserBehavior);
exports.UserBehaviorSchema = mongoose_1.SchemaFactory.createForClass(UserBehavior);
//# sourceMappingURL=user-behavior.entity.js.map