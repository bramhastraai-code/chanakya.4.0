"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenityModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const amenity_controller_1 = require("./amenity.controller");
const amenity_service_1 = require("./amenity.service");
const amenity_entity_1 = require("./entities/amenity.entity");
let AmenityModule = class AmenityModule {
};
exports.AmenityModule = AmenityModule;
exports.AmenityModule = AmenityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: amenity_entity_1.Amenity.name, schema: amenity_entity_1.AmenitySchema }]),
        ],
        controllers: [amenity_controller_1.AmenityController],
        providers: [amenity_service_1.AmenityService],
        exports: [amenity_service_1.AmenityService],
    })
], AmenityModule);
//# sourceMappingURL=amenity.module.js.map