"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderModule = void 0;
const common_1 = require("@nestjs/common");
const builder_service_1 = require("./builder.service");
const builder_controller_1 = require("./builder.controller");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("../core/entities/user.entity");
const builder_profile_entity_1 = require("./entities/builder-profile.entity");
const property_entity_1 = require("../property/entities/property.entity");
const project_entity_1 = require("../project/entities/project.entity");
const inquiry_entity_1 = require("../inquiry/entities/inquiry.entity");
const bounty_entity_1 = require("../bounty/entities/bounty.entity");
const s3_service_1 = require("../s3/s3.service");
const agent_module_1 = require("../agent/agent.module");
let BuilderModule = class BuilderModule {
};
exports.BuilderModule = BuilderModule;
exports.BuilderModule = BuilderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_entity_1.User.name, schema: user_entity_1.UserSchema },
                { name: builder_profile_entity_1.BuilderProfile.name, schema: builder_profile_entity_1.BuilderProfileSchema },
                { name: property_entity_1.Property.name, schema: property_entity_1.PropertySchema },
                { name: project_entity_1.Project.name, schema: project_entity_1.ProjectSchema },
                { name: inquiry_entity_1.Inquiry.name, schema: inquiry_entity_1.InquirySchema },
                { name: bounty_entity_1.Bounty.name, schema: bounty_entity_1.BountySchema },
            ]),
            agent_module_1.AgentModule,
        ],
        controllers: [builder_controller_1.BuilderController, builder_controller_1.BuilderAdminController],
        providers: [builder_service_1.BuilderService, s3_service_1.S3Service],
        exports: [builder_service_1.BuilderService],
    })
], BuilderModule);
//# sourceMappingURL=builder.module.js.map