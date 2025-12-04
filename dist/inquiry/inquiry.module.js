"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquiryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const inquiry_controller_1 = require("./inquiry.controller");
const inquiry_service_1 = require("./inquiry.service");
const inquiry_entity_1 = require("./entities/inquiry.entity");
const user_entity_1 = require("../core/entities/user.entity");
const property_entity_1 = require("../property/entities/property.entity");
const project_entity_1 = require("../project/entities/project.entity");
let InquiryModule = class InquiryModule {
};
exports.InquiryModule = InquiryModule;
exports.InquiryModule = InquiryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: inquiry_entity_1.Inquiry.name, schema: inquiry_entity_1.InquirySchema },
                { name: user_entity_1.User.name, schema: user_entity_1.UserSchema },
                { name: property_entity_1.Property.name, schema: property_entity_1.PropertySchema },
                { name: project_entity_1.Project.name, schema: project_entity_1.ProjectSchema },
            ]),
        ],
        controllers: [inquiry_controller_1.InquiryController],
        providers: [inquiry_service_1.InquiryService],
        exports: [inquiry_service_1.InquiryService],
    })
], InquiryModule);
//# sourceMappingURL=inquiry.module.js.map