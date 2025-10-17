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
exports.SavedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const saved_entity_1 = require("./entities/saved.entity");
let SavedService = class SavedService {
    constructor(savedModel) {
        this.savedModel = savedModel;
    }
    async create(createSavedDto) {
        const createdSaved = new this.savedModel(createSavedDto);
        return createdSaved.save();
    }
    async update(id, updateSavedDto) {
        const updatedSaved = await this.savedModel.findByIdAndUpdate(id, updateSavedDto, {
            new: true,
            runValidators: true,
        });
        if (!updatedSaved) {
            throw new common_1.NotFoundException('Saved item not found');
        }
        return updatedSaved;
    }
    async findAll(pageSize, pageNumber, sortBy = 'savedAt', sortOrder = 'asc', searchQuery) {
        const page = parseInt(pageNumber, 10) || 1;
        const limit = parseInt(pageSize, 10) || 10;
        const skip = (page - 1) * limit;
        const query = searchQuery ? { $text: { $search: searchQuery } } : {};
        const savedItems = await this.savedModel
            .find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const totalSavedItems = await this.savedModel.countDocuments(query);
        const totalPages = Math.ceil(totalSavedItems / limit);
        return {
            savedItems,
            totalPages,
            totalSavedItems,
            pageSize: limit,
            pageNumber: page,
        };
    }
    async findOne(id) {
        return this.savedModel.findById(id).exec();
    }
    async remove(id) {
        const result = await this.savedModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Saved item not found');
        }
        return result;
    }
};
exports.SavedService = SavedService;
exports.SavedService = SavedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(saved_entity_1.Saved.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SavedService);
//# sourceMappingURL=saved.service.js.map