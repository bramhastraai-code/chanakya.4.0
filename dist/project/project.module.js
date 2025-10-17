"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const project_entity_1 = require("./entities/project.entity");
const amenity_entity_1 = require("../amenity/entities/amenity.entity");
const user_entity_1 = require("../user/entity/user.entity");
const builder_entity_1 = require("../builder/entities/builder.entity");
const project_controller_1 = require("./project.controller");
const project_service_1 = require("./project.service");
const property_entity_1 = require("../property/entities/property.entity");
const property_service_1 = require("../property/property.service");
const s3_service_1 = require("../s3/s3.service");
const customer_entity_1 = require("../customer/entities/customer.entity");
let ProjectModule = class ProjectModule {
};
exports.ProjectModule = ProjectModule;
exports.ProjectModule = ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: project_entity_1.Project.name, schema: project_entity_1.ProjectSchema },
                { name: property_entity_1.Property.name, schema: property_entity_1.PropertySchema },
                { name: customer_entity_1.Customer.name, schema: customer_entity_1.CustomerSchema },
                { name: amenity_entity_1.Amenity.name, schema: amenity_entity_1.AmenitySchema },
                { name: user_entity_1.User.name, schema: user_entity_1.UserSchema },
                { name: builder_entity_1.Builder.name, schema: builder_entity_1.BuilderSchema },
            ]),
        ],
        controllers: [project_controller_1.ProjectController],
        providers: [project_service_1.ProjectService, property_service_1.PropertyService, s3_service_1.S3Service],
        exports: [project_service_1.ProjectService],
    })
], ProjectModule);
//# sourceMappingURL=project.module.js.map