"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseModule = void 0;
const common_1 = require("@nestjs/common");
const firebase_controller_1 = require("./firebase.controller");
const firebase_admin_1 = require("./firebase.admin");
const firebase_service_1 = require("./firebase.service");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("../core/entities/user.entity");
const websocket_module_1 = require("../websocket/websocket.module");
let FirebaseModule = class FirebaseModule {
};
exports.FirebaseModule = FirebaseModule;
exports.FirebaseModule = FirebaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            websocket_module_1.WebsocketModule,
            mongoose_1.MongooseModule.forFeature([{ name: user_entity_1.User.name, schema: user_entity_1.UserSchema }]),
        ],
        controllers: [firebase_controller_1.FirebaseController],
        providers: [firebase_service_1.NotificationService, firebase_admin_1.FirebaseAdmin],
        exports: [firebase_service_1.NotificationService, firebase_admin_1.FirebaseAdmin],
    })
], FirebaseModule);
//# sourceMappingURL=firebase.module.js.map