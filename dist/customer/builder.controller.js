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
exports.BuildersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_builder_dto_1 = require("./dto/create-builder.dto");
const builder_response_dto_1 = require("./dto/builder-response.dto");
const builder_service_1 = require("./builder.service");
const passport_1 = require("@nestjs/passport");
let BuildersController = class BuildersController {
    constructor(buildersService) {
        this.buildersService = buildersService;
    }
    async findAll() {
        const data = await this.buildersService.findAll();
        return { data, message: 'Builders fetched successfully' };
    }
    async findOne(req) {
        const id = req.user._id;
        const data = await this.buildersService.findOne(id);
        return { data, message: 'Builder found successfully' };
    }
    async update(req, updateBuilderDto) {
        const id = req.user._id;
        const data = await this.buildersService.update(id, updateBuilderDto);
        return { data, message: 'Builder updated successfully' };
    }
};
exports.BuildersController = BuildersController;
__decorate([
    (0, common_1.Get)('builders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all builders' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all builders',
        type: [builder_response_dto_1.BuilderResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BuildersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('builder'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Get a builder by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Builder found',
        type: builder_response_dto_1.BuilderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Builder not found' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BuildersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('builder'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Update a builder' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Builder updated successfully',
        type: builder_response_dto_1.BuilderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Builder not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_builder_dto_1.UpdateBuilderDto]),
    __metadata("design:returntype", Promise)
], BuildersController.prototype, "update", null);
exports.BuildersController = BuildersController = __decorate([
    (0, swagger_1.ApiTags)('user(builder)'),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [builder_service_1.BuildersService])
], BuildersController);
//# sourceMappingURL=builder.controller.js.map