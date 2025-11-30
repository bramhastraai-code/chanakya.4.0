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
exports.PropertySchema = exports.Property = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_entity_1 = require("../../customer/entities/customer.entity");
const project_entity_1 = require("../../project/entities/project.entity");
const property_enum_1 = require("../enum/property.enum");
const status_enum_1 = require("../../common/enum/status.enum");
let Property = class Property extends mongoose_2.Document {
};
exports.Property = Property;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Property.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Property.prototype, "propertyTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Property.prototype, "propertyDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "propertyOwner", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "OwnerContactNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "propertyExecutive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.PropertyType }),
    __metadata("design:type", String)
], Property.prototype, "propertyType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.PropertyPurpose }),
    __metadata("design:type", String)
], Property.prototype, "propertyPurpose", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.PropertyStatus }),
    __metadata("design:type", String)
], Property.prototype, "propertyStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.PropertyCategory }),
    __metadata("design:type", String)
], Property.prototype, "propertyCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.BHKConfiguration }),
    __metadata("design:type", String)
], Property.prototype, "bhkConfiguration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.FurnishingStatus }),
    __metadata("design:type", String)
], Property.prototype, "furnishingStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "propertyAge", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "propertyAgeMonth", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "totalArea", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "carpetArea", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "balconyCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "bathroomCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "bedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "parkingCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "floorNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "totalFloors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.FacingDirection }),
    __metadata("design:type", String)
], Property.prototype, "facingDirection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Amenity' }] }),
    __metadata("design:type", mongoose_2.Types.Array)
], Property.prototype, "amenities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Amenity' }] }),
    __metadata("design:type", mongoose_2.Types.Array)
], Property.prototype, "facilities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Property.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "region", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "landmark", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "roadDistance", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "pinCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "pricePerUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "maintenanceCharge", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "deposit", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Property.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Property.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Property.prototype, "videoLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Property.prototype, "floorPlan", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Property.prototype, "masterPlan", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Property.prototype, "seoTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Property.prototype, "seoDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], index: true }),
    __metadata("design:type", Array)
], Property.prototype, "seoKeywords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.PlotType }),
    __metadata("design:type", String)
], Property.prototype, "plotType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: undefined, enum: property_enum_1.PGAvailableFor }),
    __metadata("design:type", String)
], Property.prototype, "pgAvailableFor", void 0);
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
], Property.prototype, "tags", void 0);
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
], Property.prototype, "offers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Property.prototype, "featured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Customer' }),
    __metadata("design:type", customer_entity_1.Customer)
], Property.prototype, "builderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project' }),
    __metadata("design:type", project_entity_1.Project)
], Property.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Property.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Customer' }),
    __metadata("design:type", customer_entity_1.Customer)
], Property.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Property.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Property.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Property.prototype, "approvalStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Property.prototype, "approvalNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Property.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Property.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Property.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Property.prototype, "views", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: status_enum_1.Status.IN_ACTIVE, enum: status_enum_1.Status }),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                resource: { type: String },
                distance: { type: Number },
            },
        ],
        required: false,
        default: [],
    }),
    __metadata("design:type", Array)
], Property.prototype, "nearby", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Property.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Property.prototype, "updatedAt", void 0);
exports.Property = Property = __decorate([
    (0, mongoose_1.Schema)({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
], Property);
exports.PropertySchema = mongoose_1.SchemaFactory.createForClass(Property);
exports.PropertySchema.index({
    propertyTitle: 'text',
    propertyDescription: 'text',
    address: 'text',
    seoTitle: 'text',
    seoKeywords: 'text',
});
//# sourceMappingURL=property.entity.js.map