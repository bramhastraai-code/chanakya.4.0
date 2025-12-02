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
exports.SearchFilterService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const property_entity_1 = require("../property/entities/property.entity");
const project_entity_1 = require("../project/entities/project.entity");
const search_record_entity_1 = require("./entity/search-record.entity");
let SearchFilterService = class SearchFilterService {
    constructor(propertyModel, projectModel, searchRecordModel) {
        this.propertyModel = propertyModel;
        this.projectModel = projectModel;
        this.searchRecordModel = searchRecordModel;
    }
    async getSuggestions(query) {
        return this.searchRecordModel
            .find({ term: new RegExp(query, 'i'), userId: null })
            .sort({ popularity: -1 })
            .limit(10)
            .select('term -_id')
            .then((results) => results.map((result) => result.term));
    }
    async storeSearch(userId, term) {
        const now = new Date();
        await this.searchRecordModel.create({ term, userId, searchedAt: now });
        await this.searchRecordModel.updateOne({ term, userId: null }, { $inc: { popularity: 1 } }, { upsert: true });
    }
    async search(term, paginationDto) {
        try {
            const { page, limit } = paginationDto;
            const skip = (page - 1) * limit;
            const projects = await this.projectModel
                .find({ projectName: { $regex: term, $options: 'i' } })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
            const properties = await this.propertyModel
                .find({ propertyTitle: { $regex: term, $options: 'i' } })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
            const projectsWithTitle = projects.map((project) => ({
                _id: project._id,
                title: project.projectName,
                thumbnail: project.thumbnail,
                description: project.description,
                address: project.address,
                city: project.city,
                priceMin: project.priceMin,
                priceMax: project.priceMax,
                minCarpetArea: project.minCarpetArea,
                maxCarpetArea: project.maxCarpetArea,
                tags: project.tags,
                amenities: project.amenities,
                itsTypeIs: 'PROJECT',
            }));
            const propertiesWithTitle = properties.map((property) => ({
                _id: property._id,
                title: property.propertyTitle,
                thumbnail: property.thumbnail,
                description: property.seoDescription,
                address: property.address,
                city: property.city,
                price: property.price,
                totalArea: property.totalArea,
                tags: property.tags,
                amenities: property.amenities,
                itsTypeIs: 'PROPERTY',
            }));
            const combinedResults = [...projectsWithTitle, ...propertiesWithTitle];
            return {
                status: 200,
                message: 'retrieve successfully',
                count: combinedResults.length,
                data: combinedResults,
            };
        }
        catch (error) {
            throw new Error('Error fetching search results: ' + error.message);
        }
    }
};
exports.SearchFilterService = SearchFilterService;
exports.SearchFilterService = SearchFilterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_entity_1.Property.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_entity_1.Project.name)),
    __param(2, (0, mongoose_1.InjectModel)(search_record_entity_1.SearchRecord.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SearchFilterService);
//# sourceMappingURL=search-filter.service.js.map