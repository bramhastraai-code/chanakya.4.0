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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const role_service_1 = require("./role.service");
const role_entity_1 = require("./entity/role.entity");
let RoleController = class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    async create(createRoleDto) {
        const data = await this.roleService.create(createRoleDto);
        return { data, message: 'created successfully ' };
    }
    async findAll(page, limit, sortBy, sortOrder, name) {
        const data = await this.roleService.findAll({
            page,
            limit,
            sortBy,
            sortOrder,
            name,
        });
        return { data, message: 'data retrieve successfully' };
    }
    async findOne(id) {
        const data = await this.roleService.findOne(id);
        return { data, message: 'retrieve successful' };
    }
    async update(id, updateRoleDto) {
        const data = await this.roleService.update(id, updateRoleDto);
        return { data, message: 'successful' };
    }
    async remove(id) {
        return this.roleService.remove(id);
    }
    async roleList() {
        const data = await this.roleService.roleList();
        return { data, message: 'data retrieve successfully' };
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new role' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Role successfully created.',
        type: role_entity_1.Role,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of roles retrieved successfully.',
        type: [role_entity_1.Role],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: true,
        type: Number,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: true,
        type: Number,
        description: 'Number of items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        type: String,
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        type: String,
        description: 'Sort order (asc or desc)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        required: false,
        type: String,
        description: 'Name filter',
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('role/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single role by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Role retrieved successfully.',
        type: role_entity_1.Role,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('role/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a role by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Role updated successfully.',
        type: role_entity_1.Role,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('role/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a role by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('role-list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of roles retrieved successfully.',
        type: [role_entity_1.Role],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "roleList", null);
exports.RoleController = RoleController = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map