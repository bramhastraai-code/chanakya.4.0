"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentInquiryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const agent_inquiry_service_1 = require("./agent-inquiry.service");
const agent_inquiry_controller_1 = require("./agent-inquiry.controller");
const agent_inquiry_entity_1 = require("./entities/agent-inquiry.entity");
let AgentInquiryModule = class AgentInquiryModule {
};
exports.AgentInquiryModule = AgentInquiryModule;
exports.AgentInquiryModule = AgentInquiryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: agent_inquiry_entity_1.AgentInquiry.name, schema: agent_inquiry_entity_1.AgentInquirySchema },
            ]),
        ],
        controllers: [agent_inquiry_controller_1.AgentInquiryController],
        providers: [agent_inquiry_service_1.AgentInquiryService],
        exports: [agent_inquiry_service_1.AgentInquiryService],
    })
], AgentInquiryModule);
//# sourceMappingURL=agent-inquiry.module.js.map