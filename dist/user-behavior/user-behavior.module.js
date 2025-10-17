"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBehaviorModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_behavior_entity_1 = require("./entities/user-behavior.entity");
const customer_entity_1 = require("../customer/entities/customer.entity");
const user_behavior_controller_1 = require("./user-behavior.controller");
const user_behavior_service_1 = require("./user-behavior.service");
let UserBehaviorModule = class UserBehaviorModule {
};
exports.UserBehaviorModule = UserBehaviorModule;
exports.UserBehaviorModule = UserBehaviorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_behavior_entity_1.UserBehavior.name, schema: user_behavior_entity_1.UserBehaviorSchema },
                { name: customer_entity_1.Customer.name, schema: customer_entity_1.CustomerSchema },
            ]),
        ],
        controllers: [user_behavior_controller_1.UserBehaviorController],
        providers: [user_behavior_service_1.UserBehaviorService],
        exports: [user_behavior_service_1.UserBehaviorService],
    })
], UserBehaviorModule);
//# sourceMappingURL=user-behavior.module.js.map