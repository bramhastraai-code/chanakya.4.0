"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const customer_service_1 = require("./customer.service");
const customer_controller_1 = require("./customer.controller");
const mongoose_1 = require("@nestjs/mongoose");
const customer_entity_1 = require("./entities/customer.entity");
const property_entity_1 = require("../property/entities/property.entity");
const project_entity_1 = require("../project/entities/project.entity");
const inquiry_entity_1 = require("../inquiry/entities/inquiry.entity");
const project_service_1 = require("../project/project.service");
const property_service_1 = require("../property/property.service");
const inquiry_service_1 = require("../inquiry/inquiry.service");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const firebase_service_1 = require("../firebase/firebase.service");
const firebase_admin_1 = require("../firebase/firebase.admin");
let CustomerModule = class CustomerModule {
};
exports.CustomerModule = CustomerModule;
exports.CustomerModule = CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: customer_entity_1.Customer.name, schema: customer_entity_1.CustomerSchema },
                { name: property_entity_1.Property.name, schema: property_entity_1.PropertySchema },
                { name: project_entity_1.Project.name, schema: project_entity_1.ProjectSchema },
                { name: inquiry_entity_1.Inquiry.name, schema: inquiry_entity_1.InquirySchema },
            ]),
        ],
        controllers: [customer_controller_1.CustomerController],
        providers: [
            firebase_admin_1.FirebaseAdmin,
            firebase_service_1.NotificationService,
            customer_service_1.CustomerService,
            project_service_1.ProjectService,
            property_service_1.PropertyService,
            inquiry_service_1.InquiryService,
            websocket_gateway_1.WebSocketGatewayHandler,
        ],
    })
], CustomerModule);
//# sourceMappingURL=customer.module.js.map