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
const mongoose_1 = require("@nestjs/mongoose");
const builder_service_1 = require("./builder.service");
const builder_controller_1 = require("./builder.controller");
const builder_entity_1 = require("./entities/builder.entity");
const project_module_1 = require("../project/project.module");
const project_entity_1 = require("../project/entities/project.entity");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./strategy/jwt.strategy");
let BuilderModule = class BuilderModule {
};
exports.BuilderModule = BuilderModule;
exports.BuilderModule = BuilderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({}),
            project_module_1.ProjectModule,
            mongoose_1.MongooseModule.forFeature([
                { name: builder_entity_1.Builder.name, schema: builder_entity_1.BuilderSchema },
                { name: project_entity_1.Project.name, schema: project_entity_1.ProjectSchema },
            ]),
        ],
        controllers: [builder_controller_1.BuilderController],
        providers: [builder_service_1.BuilderService, jwt_strategy_1.adminJwtStrategy],
        exports: [builder_service_1.BuilderService],
    })
], BuilderModule);
//# sourceMappingURL=builder.module.js.map