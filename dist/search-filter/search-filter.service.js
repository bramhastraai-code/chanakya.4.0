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
const amenity_entity_1 = require("../amenity/entities/amenity.entity");
const property_entity_1 = require("../property/entities/property.entity");
const project_entity_1 = require("../project/entities/project.entity");
const search_enum_1 = require("./enum/search.enum");
const search_record_entity_1 = require("./entity/search-record.entity");
let SearchFilterService = class SearchFilterService {
    constructor(propertyModel, projectModel, searchRecordModel) {
        this.propertyModel = propertyModel;
        this.projectModel = projectModel;
        this.searchRecordModel = searchRecordModel;
    }
    async PropertyCardList(filterDto) {
        const { page = 1, limit = 10, city, search, type } = filterDto;
        let results = [], total = 0;
        const skip = (page - 1) * limit;
        if (type === search_enum_1.EntityType.PROPERTY) {
            const query = this.buildPropertyQuery(city, search);
            [results, total] = await Promise.all([
                this.propertyModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .populate({ path: 'amenities', model: amenity_entity_1.Amenity.name })
                    .exec(),
                this.propertyModel.countDocuments(query).exec(),
            ]);
            if (results.length === 0 && city) {
                const fallbackQuery = this.buildPropertyQuery(undefined, search);
                [results, total] = await Promise.all([
                    this.propertyModel
                        .find(fallbackQuery)
                        .skip(skip)
                        .limit(limit)
                        .populate({ path: 'amenities', model: amenity_entity_1.Amenity.name })
                        .exec(),
                    this.propertyModel.countDocuments(fallbackQuery).exec(),
                ]);
            }
            results = results.map(this.formatProperty);
        }
        else if (type === search_enum_1.EntityType.PROJECT) {
            const query = this.buildProjectQuery(city, search);
            [results, total] = await Promise.all([
                this.projectModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .populate({ path: 'amenities', model: amenity_entity_1.Amenity.name })
                    .exec(),
                this.projectModel.countDocuments(query).exec(),
            ]);
            if (results.length === 0 && city) {
                const fallbackQuery = this.buildProjectQuery(undefined, search);
                [results, total] = await Promise.all([
                    this.projectModel
                        .find(fallbackQuery)
                        .skip(skip)
                        .limit(limit)
                        .populate({ path: 'amenities', model: amenity_entity_1.Amenity.name })
                        .exec(),
                    this.projectModel.countDocuments(fallbackQuery).exec(),
                ]);
            }
            results = results.map(this.formatProject);
        }
        return { total, page, limit, results };
    }
    buildPropertyQuery(city, search) {
        const query = {};
        if (city) {
            query.$or = [
                { address: { $regex: city, $options: 'i' } },
                { city: { $regex: city, $options: 'i' } },
                { seoTitle: { $regex: city, $options: 'i' } },
                { seoDescription: { $regex: city, $options: 'i' } },
                { seoKeywords: { $regex: city, $options: 'i' } },
                { region: { $regex: city, $options: 'i' } },
            ];
        }
        if (search) {
            query.$text = { $search: search };
        }
        return query;
    }
    buildProjectQuery(city, search) {
        const query = {};
        if (city) {
            query.$or = [
                { address: { $regex: city, $options: 'i' } },
                { city: { $regex: city, $options: 'i' } },
                { seoTitle: { $regex: city, $options: 'i' } },
                { seoDescription: { $regex: city, $options: 'i' } },
                { seoKeywords: { $regex: city, $options: 'i' } },
                { region: { $regex: city, $options: 'i' } },
            ];
        }
        if (search) {
            query.$text = { $search: search };
        }
        return query;
    }
    formatProperty(property) {
        return {
            _id: property._id,
            title: property.propertyTitle,
            location: property.address,
            price: `${property.price} USD`,
            imageUrl: property.thumbnail,
            tags: property.tags.map((tag) => ({
                text: tag.text,
                variant: tag.variant,
                iconUrl: tag.iconUrl,
            })),
            amenities: property.amenities.map((amenity) => ({
                text: amenity.name,
                iconLocation: amenity.iconImage,
            })),
            crmDetails: {
                crmName: 'rakesh',
                crmProfileImageUrl: 'https://picsum.photos/id/1/200/300',
                crmResponseTime: '15 min',
                crmMobile: '9993313600',
                crmRole: 'user',
            },
        };
    }
    formatProject(project) {
        return {
            _id: project._id,
            title: project.projectName,
            location: project.address,
            priceMin: project.priceMin,
            priceMax: project.priceMax,
            minCarpetArea: project.minCarpetArea,
            maxCarpetArea: project.maxCarpetArea,
            imageUrl: project.thumbnail,
            tags: project.tags.map((tag) => ({
                text: tag.text,
                variant: tag.variant,
                iconUrl: tag.iconUrl,
            })),
            amenities: project.amenities.map((amenity) => ({
                text: amenity.name,
                iconLocation: amenity.iconImage,
            })),
            readyToPossessDate: project.readyToPossessDate,
            crmDetails: {
                crmName: 'rakesh',
                crmProfileImageUrl: 'https://picsum.photos/id/1/200/300',
                crmResponseTime: '15 min',
                crmMobile: '9993313600',
                crmRole: 'user',
            },
        };
    }
    async PropertyCardList_v2(filterDto) {
        const { page = 1, limit = 10, city, search, type, minPrice, maxPrice, minArea, maxArea, sort, propertyType, propertyConfig, } = filterDto;
        console.log('filterDto', filterDto);
        const skip = (page - 1) * limit;
        let results = [];
        let total = 0;
        const query = type === search_enum_1.EntityType.PROPERTY
            ? this.buildPropertyQuery_V2(city, search, minPrice, maxPrice, minArea, maxArea, propertyType, propertyConfig)
            : this.buildProjectQuery_V2(city, search, minPrice, maxPrice, minArea, maxArea, propertyType, propertyConfig);
        const projection = type === search_enum_1.EntityType.PROPERTY
            ? {
                title: 1,
                address: 1,
                price: 1,
                area: 1,
                thumbnail: 1,
                tags: 1,
                amenities: 1,
                propertyType: 1,
                propertyConfig: 1,
            }
            : {
                projectName: 1,
                address: 1,
                priceMin: 1,
                priceMax: 1,
                minCarpetArea: 1,
                maxCarpetArea: 1,
                thumbnail: 1,
                tags: 1,
                amenities: 1,
                readyToPossessDate: 1,
                propertyType: 1,
                propertyConfig: 1,
            };
        const sortOptionsProperty = this.getSortOptionsProperty_v2(sort);
        const sortOptionsProject = this.getSortOptionsProject_v2(sort);
        [results, total] = await Promise.all([
            type === search_enum_1.EntityType.PROPERTY
                ? this.propertyModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort(sortOptionsProperty)
                    .select(projection)
                    .populate({ path: 'amenities', model: amenity_entity_1.Amenity.name })
                    .exec()
                : this.projectModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort(sortOptionsProject)
                    .select(projection)
                    .populate({ path: 'amenities', model: amenity_entity_1.Amenity.name })
                    .exec(),
            type === search_enum_1.EntityType.PROPERTY
                ? this.propertyModel.countDocuments(query).exec()
                : this.projectModel.countDocuments(query).exec(),
        ]);
        results =
            type === search_enum_1.EntityType.PROPERTY
                ? results.map(this.formatProperty_V2)
                : results.map(this.formatProject_V2);
        return { total, page, limit, results };
    }
    buildPropertyQuery_V2(city, search, minPrice, maxPrice, minArea, maxArea, propertyType, propertyConfig) {
        const query = {};
        const andConditions = [];
        if (city) {
            andConditions.push({
                $or: [
                    { address: { $regex: city, $options: 'i' } },
                    { city: { $regex: city, $options: 'i' } },
                ],
            });
        }
        if (search) {
            andConditions.push({
                $text: { $search: search },
            });
        }
        if (minPrice !== undefined) {
            andConditions.push({ price: { $gte: minPrice } });
        }
        if (maxPrice !== undefined) {
            andConditions.push({ price: { $lte: maxPrice } });
        }
        if (minArea !== undefined) {
            andConditions.push({ totalArea: { $gte: minArea } });
        }
        if (maxArea !== undefined) {
            andConditions.push({ totalArea: { $lte: maxArea } });
        }
        if (propertyType) {
            andConditions.push({
                $or: [{ propertyType: { $regex: propertyType, $options: 'i' } }],
            });
        }
        if (propertyConfig) {
            andConditions.push({
                $or: [{ bhkConfiguration: { $regex: propertyConfig, $options: 'i' } }],
            });
        }
        if (andConditions.length > 0) {
            query.$and = andConditions;
        }
        return query;
    }
    buildProjectQuery_V2(city, search, minPrice, maxPrice, minArea, maxArea, propertyType, propertyConfig) {
        const query = {};
        const andConditions = [];
        if (city) {
            andConditions.push({
                $or: [
                    { address: { $regex: city, $options: 'i' } },
                    { city: { $regex: city, $options: 'i' } },
                ],
            });
        }
        if (search) {
            andConditions.push({
                $text: { $search: search },
            });
        }
        if (minPrice !== undefined) {
            andConditions.push({ priceMin: { $gte: minPrice } });
        }
        if (maxPrice !== undefined) {
            andConditions.push({ priceMax: { $lte: maxPrice } });
        }
        if (minArea !== undefined) {
            andConditions.push({ minCarpetArea: { $gte: minArea } });
        }
        if (maxArea !== undefined) {
            andConditions.push({ maxCarpetArea: { $lte: maxArea } });
        }
        if (propertyType) {
            andConditions.push({
                $or: [{ projectType: { $regex: propertyType, $options: 'i' } }],
            });
        }
        if (propertyConfig && propertyConfig.length > 0) {
            andConditions.push({
                PropertyConfig: { $in: propertyConfig },
            });
        }
        if (andConditions.length > 0) {
            query.$and = andConditions;
        }
        return query;
    }
    getSortOptionsProperty_v2(sort) {
        switch (sort) {
            case 'priceAsc':
                return { price: 1 };
            case 'priceDesc':
                return { price: -1 };
            case 'areaAsc':
                return { totalArea: 1 };
            case 'areaDesc':
                return { totalArea: -1 };
            default:
                return {};
        }
    }
    getSortOptionsProject_v2(sort) {
        switch (sort) {
            case 'priceAsc':
                return { priceAverage: 1 };
            case 'priceDesc':
                return { priceAverage: -1 };
            case 'areaAsc':
                return { maxCarpetArea: 1 };
            case 'areaDesc':
                return { minCarpetArea: -1 };
            default:
                return {};
        }
    }
    formatProperty_V2(property) {
        return property;
    }
    formatProject_V2(project) {
        return project;
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