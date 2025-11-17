"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const builder_entity_1 = require("../entities/builder.entity");
let adminJwtStrategy = class adminJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'builder-jwt') {
    constructor(config, builderModel) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        });
        this.builderModel = builderModel;
    }
    async validate(payload) {
        const user = await this.builderModel.findById({
            _id: payload.sub,
        });
        console.log('jwtStrategy builder validate payload', payload, user);
        return user;
    }
};
exports.adminJwtStrategy = adminJwtStrategy;
exports.adminJwtStrategy = adminJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(builder_entity_1.Builder.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_1.Model])
], adminJwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map