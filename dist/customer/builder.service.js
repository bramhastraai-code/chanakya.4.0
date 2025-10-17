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
exports.BuildersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usertype_enum_1 = require("./enum/usertype.enum");
const customer_entity_1 = require("./entities/customer.entity");
let BuildersService = class BuildersService {
    constructor(customerModel) {
        this.customerModel = customerModel;
    }
    async findAll() {
        return this.customerModel.find({ userType: usertype_enum_1.UserType.BUILDER }).exec();
    }
    async findOne(id) {
        const builder = await this.customerModel.findOne({
            _id: id,
            userType: usertype_enum_1.UserType.BUILDER,
        });
        return builder;
    }
    async update(id, updateBuilderDto) {
        const updatedBuilder = await this.customerModel.findOneAndUpdate({ _id: id, userType: usertype_enum_1.UserType.BUILDER }, updateBuilderDto, { new: true });
        return updatedBuilder;
    }
};
exports.BuildersService = BuildersService;
exports.BuildersService = BuildersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_entity_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BuildersService);
//# sourceMappingURL=builder.service.js.map