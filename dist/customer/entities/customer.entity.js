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
exports.CustomerSchema = exports.Customer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usertype_enum_1 = require("../enum/usertype.enum");
let Customer = class Customer extends mongoose_2.Document {
};
exports.Customer = Customer;
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: 'text' }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "userImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Customer.prototype, "fcmToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        trim: true,
        lowercase: true,
        index: true,
        sparse: true,
    }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: usertype_enum_1.UserType.USER, enum: usertype_enum_1.UserType }),
    __metadata("design:type", String)
], Customer.prototype, "userType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null,
    }),
    __metadata("design:type", Object)
], Customer.prototype, "assignAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [] }),
    __metadata("design:type", Array)
], Customer.prototype, "projectsApplied", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: usertype_enum_1.LeadStatus,
        default: 'new',
    }),
    __metadata("design:type", String)
], Customer.prototype, "contactStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: '1 day' }),
    __metadata("design:type", String)
], Customer.prototype, "responseTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Customer.prototype, "serviceAreas", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(usertype_enum_1.VerificationStatus),
        default: usertype_enum_1.VerificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Customer.prototype, "verificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Customer.prototype, "verificationDocuments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "licenseNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Customer.prototype, "licenseExpiry", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Customer.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "agencyName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "agencyLicense", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Customer.prototype, "agencyFoundedYear", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "teamSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "reviewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "closedDeals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: usertype_enum_1.UserStatus.ACTIVE, enum: usertype_enum_1.UserStatus }),
    __metadata("design:type", String)
], Customer.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true }),
    __metadata("design:type", String)
], Customer.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true }),
    __metadata("design:type", String)
], Customer.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true }),
    __metadata("design:type", String)
], Customer.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true }),
    __metadata("design:type", String)
], Customer.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "pinCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Builder' }],
        default: [],
    }),
    __metadata("design:type", Array)
], Customer.prototype, "builders", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Customer.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Customer.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                previousStatus: { type: String, enum: usertype_enum_1.LeadStatus },
                newStatus: { type: String, enum: usertype_enum_1.LeadStatus },
                changedBy: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' },
                changedAt: { type: Date, default: Date.now },
                notes: String,
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Customer.prototype, "statusHistory", void 0);
exports.Customer = Customer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Customer);
exports.CustomerSchema = mongoose_1.SchemaFactory.createForClass(Customer);
exports.CustomerSchema.index({
    name: 'text',
    email: 'text',
    agencyName: 'text',
    UserType: 'text',
});
//# sourceMappingURL=customer.entity.js.map