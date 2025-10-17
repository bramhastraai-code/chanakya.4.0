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
exports.SavedController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const saved_service_1 = require("./saved.service");
const saved_entity_1 = require("./entities/saved.entity");
const create_saved_dto_1 = require("./dto/create-saved.dto");
const update_saved_dto_1 = require("./dto/update-saved.dto");
let SavedController = class SavedController {
    constructor(savedService) {
        this.savedService = savedService;
    }
    async create(createSavedDto) {
        try {
            const data = await this.savedService.create(createSavedDto);
            return { data, message: 'Saved item created successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while creating the saved item.');
        }
    }
    async update(id, updateSavedDto) {
        try {
            const updatedSaved = await this.savedService.update(id, updateSavedDto);
            if (!updatedSaved) {
                throw new common_1.NotFoundException('Saved item not found');
            }
            return updatedSaved;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while updating the saved item.');
        }
    }
    async findAll(pageSize, pageNumber, sortBy = 'savedAt', sortOrder = 'asc', searchQuery) {
        try {
            const data = await this.savedService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery);
            if (!data.savedItems || data.savedItems.length === 0) {
                throw new common_1.NotFoundException('No saved items found');
            }
            return { data, message: 'Retrieved saved items successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving saved items.');
        }
    }
    async findOne(id) {
        try {
            const savedItem = await this.savedService.findOne(id);
            if (!savedItem) {
                throw new common_1.NotFoundException('Saved item not found');
            }
            return { data: savedItem, message: 'Saved item retrieved successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the saved item.');
        }
    }
    async remove(id) {
        try {
            const result = await this.savedService.remove(id);
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Saved item not found');
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while deleting the saved item.');
        }
    }
};
exports.SavedController = SavedController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new saved item' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Saved item created successfully',
        type: saved_entity_1.Saved,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_saved_dto_1.CreateSavedDto]),
    __metadata("design:returntype", Promise)
], SavedController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('save/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing saved item' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Saved item updated successfully',
        type: saved_entity_1.Saved,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Saved item not found',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_saved_dto_1.UpdateSavedDto]),
    __metadata("design:returntype", Promise)
], SavedController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all saved items with pagination, sorting, and search',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        type: Number,
        required: true,
        description: 'Number of saved items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        type: Number,
        required: true,
        description: 'Page number to retrieve',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        type: String,
        required: false,
        enum: ['savedAt', 'createdAt', 'updatedAt'],
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        type: String,
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        type: String,
        required: false,
        description: 'Search term for filtering saved items',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of saved items retrieved successfully',
        type: [saved_entity_1.Saved],
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No saved items found',
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SavedController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('save/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single saved item by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The saved item details',
        type: saved_entity_1.Saved,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Saved item not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SavedController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('save/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a saved item by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Saved item deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Saved item not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SavedController.prototype, "remove", null);
exports.SavedController = SavedController = __decorate([
    (0, swagger_1.ApiTags)('saved'),
    (0, common_1.Controller)('saved'),
    __metadata("design:paramtypes", [saved_service_1.SavedService])
], SavedController);
//# sourceMappingURL=saved.controller.js.map