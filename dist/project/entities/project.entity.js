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
exports.ProjectSchema = exports.Project = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const amenity_entity_1 = require("../../amenity/entities/amenity.entity");
const builder_entity_1 = require("../../builder/entities/builder.entity");
const user_entity_1 = require("../../user/entity/user.entity");
const project_enum_1 = require("../enum/project.enum");
const status_enum_1 = require("../../common/enum/status.enum");
const property_enum_1 = require("../../property/enum/property.enum");
const project_enum_2 = require("../project.enum");
let Project = class Project extends mongoose_2.Document {
};
exports.Project = Project;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Project.prototype, "projectName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: () => mongoose_2.Schema.Types.ObjectId,
        ref: 'Builder',
        required: true,
    }),
    __metadata("design:type", builder_entity_1.Builder)
], Project.prototype, "builder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "projectType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: project_enum_1.ProjectCategory.NEWLY_ADDED,
        enum: project_enum_1.ProjectCategory,
        required: true,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: project_enum_1.ProjectAffordability.AFFORDABLE,
        enum: project_enum_1.ProjectAffordability,
        required: true,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectAffordability", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: project_enum_2.ProjectStatus }),
    __metadata("design:type", String)
], Project.prototype, "projectStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: Object.values(property_enum_1.BHKConfiguration) }),
    __metadata("design:type", Array)
], Project.prototype, "PropertyConfig", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Project.prototype, "priceAverage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Project.prototype, "priceMin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Project.prototype, "priceMax", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Project.prototype, "videoLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Project.prototype, "floorPlan", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Project.prototype, "masterPlan", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                resource: { type: String },
                distance: { type: String },
            },
        ],
        required: false,
        default: [],
    }),
    __metadata("design:type", Array)
], Project.prototype, "nearby", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Project.prototype, "minCarpetArea", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Project.prototype, "maxCarpetArea", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Project.prototype, "since", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Project.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Project.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Project.prototype, "pinCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Project.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Project.prototype, "region", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Project.prototype, "landmark", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Project.prototype, "roadDistance", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Project.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Project.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.Schema.Types.ObjectId],
        ref: amenity_entity_1.Amenity.name,
    }),
    __metadata("design:type", Array)
], Project.prototype, "amenities", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.Schema.Types.ObjectId],
        ref: amenity_entity_1.Amenity.name,
    }),
    __metadata("design:type", Array)
], Project.prototype, "facilities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: () => [mongoose_2.Schema.Types.ObjectId], ref: () => 'property' }),
    __metadata("design:type", Array)
], Project.prototype, "properties", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Project.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Project.prototype, "seoTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Project.prototype, "seoDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], index: true }),
    __metadata("design:type", Array)
], Project.prototype, "seoKeywords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "reraNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Project.prototype, "view", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: status_enum_1.Status.IN_ACTIVE,
        enum: status_enum_1.Status,
        required: true,
    }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                text: String,
                variant: { type: String, enum: property_enum_1.TagVariant },
                iconUrl: String,
            },
        ],
    }),
    __metadata("design:type", Array)
], Project.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                text: String,
                variant: { type: String, enum: property_enum_1.OfferVariant },
                description: String,
            },
        ],
    }),
    __metadata("design:type", Array)
], Project.prototype, "offers", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: null,
        type: () => mongoose_2.Schema.Types.ObjectId,
        ref: () => user_entity_1.User.name,
        required: false,
    }),
    __metadata("design:type", user_entity_1.User)
], Project.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: null,
        type: () => mongoose_2.Schema.Types.ObjectId,
        ref: () => user_entity_1.User.name,
        required: false,
    }),
    __metadata("design:type", user_entity_1.User)
], Project.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Project.prototype, "featured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Project.prototype, "exclusive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: null,
        type: () => mongoose_2.Schema.Types.ObjectId,
        ref: () => user_entity_1.User.name,
        required: false,
    }),
    __metadata("design:type", user_entity_1.User)
], Project.prototype, "executiveUser", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Project.prototype, "readyToPossessDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Project.prototype, "quickBuy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
exports.Project = Project = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Project);
exports.ProjectSchema = mongoose_1.SchemaFactory.createForClass(Project);
exports.ProjectSchema.index({
    projectName: 'text',
    description: 'text',
    address: 'text',
    seoTitle: 'text',
    seoKeywords: 'text',
});
exports.ProjectSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
//# sourceMappingURL=project.entity.js.map