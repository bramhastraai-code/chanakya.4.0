"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAuthModule = void 0;
const common_1 = require("@nestjs/common");
const customer_auth_service_1 = require("./customer-auth.service");
const customer_auth_controller_1 = require("./customer-auth.controller");
const mongoose_1 = require("@nestjs/mongoose");
const customer_entity_1 = require("../customer/entities/customer.entity");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./strategy/jwt.strategy");
const otp_entity_1 = require("./entity/otp.entity");
const customer_service_1 = require("../customer/customer.service");
let CustomerAuthModule = class CustomerAuthModule {
};
exports.CustomerAuthModule = CustomerAuthModule;
exports.CustomerAuthModule = CustomerAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            mongoose_1.MongooseModule.forFeature([
                { name: customer_entity_1.Customer.name, schema: customer_entity_1.CustomerSchema },
                { name: otp_entity_1.Otp.name, schema: otp_entity_1.OtpSchema },
            ]),
        ],
        controllers: [customer_auth_controller_1.CustomerAuthController],
        providers: [customer_auth_service_1.CustomerAuthService, jwt_strategy_1.jwtStrategy, customer_service_1.CustomerService],
    })
], CustomerAuthModule);
//# sourceMappingURL=customer-auth.module.js.map