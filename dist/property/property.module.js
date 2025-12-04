"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModule = void 0;
const common_1 = require("@nestjs/common");
const property_service_1 = require("./property.service");
const property_controller_1 = require("./property.controller");
const mongoose_1 = require("@nestjs/mongoose");
const property_entity_1 = require("./entities/property.entity");
const bookmarked_property_entity_1 = require("./entities/bookmarked-property.entity");
const s3_service_1 = require("../s3/s3.service");
let PropertyModule = class PropertyModule {
};
exports.PropertyModule = PropertyModule;
exports.PropertyModule = PropertyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: property_entity_1.Property.name, schema: property_entity_1.PropertySchema },
                { name: bookmarked_property_entity_1.BookmarkedProperty.name, schema: bookmarked_property_entity_1.BookmarkedPropertySchema },
            ]),
        ],
        controllers: [
            property_controller_1.PropertyController,
            property_controller_1.UserPropertyController,
            property_controller_1.AgentPropertyController,
            property_controller_1.BuilderPropertyController,
            property_controller_1.AdminPropertyController,
            property_controller_1.PublicPropertiesController,
        ],
        providers: [property_service_1.PropertyService, s3_service_1.S3Service],
        exports: [property_service_1.PropertyService],
    })
], PropertyModule);
//# sourceMappingURL=property.module.js.map