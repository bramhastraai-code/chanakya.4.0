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
exports.SearchFilterController = void 0;
const common_1 = require("@nestjs/common");
const search_filter_service_1 = require("./search-filter.service");
const swagger_1 = require("@nestjs/swagger");
const filter_dto_1 = require("./dto/filter.dto");
const create_search_filter_dto_1 = require("./dto/create-search-filter.dto");
let SearchFilterController = class SearchFilterController {
    constructor(searchFilterService) {
        this.searchFilterService = searchFilterService;
    }
    async getPropertyList(filterDto) {
        const data = await this.searchFilterService.PropertyCardList(filterDto);
        return { data, message: 'retrieve successfully' };
    }
    async getProperties(filterDto) {
        const data = await this.searchFilterService.PropertyCardList_v2(filterDto);
        return { data, message: 'retrieve successfully' };
    }
    async getSuggestions(query) {
        return this.searchFilterService.getSuggestions(query);
    }
    async storeSearch(createSearchDto) {
        const { userId, term } = createSearchDto;
        return this.searchFilterService.storeSearch(userId, term);
    }
    async searchSuggestions(term, paginationDto) {
        if (!term || term.trim() === '') {
            throw new Error('Search term cannot be empty');
        }
        const data = await this.searchFilterService.search(term, paginationDto);
        return { data, message: 'retrieve successfully' };
    }
};
exports.SearchFilterController = SearchFilterController;
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get filtered list of properties or projects' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.PropertyFilterDto]),
    __metadata("design:returntype", Promise)
], SearchFilterController.prototype, "getPropertyList", null);
__decorate([
    (0, common_1.Get)('search-filter'),
    (0, swagger_1.ApiOperation)({ summary: 'Get filtered property listings' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.PropertyFilter_V2_Dto]),
    __metadata("design:returntype", Promise)
], SearchFilterController.prototype, "getProperties", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get auto-complete search suggestions' }),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        type: String,
        description: 'Search term to get suggestions for',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of search suggestions',
        type: [String],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameter' }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchFilterController.prototype, "getSuggestions", null);
__decorate([
    (0, common_1.Post)('store'),
    (0, swagger_1.ApiOperation)({ summary: 'Store a search term for history and suggestions' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Search term successfully stored' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_search_filter_dto_1.CreateSearchDto]),
    __metadata("design:returntype", Promise)
], SearchFilterController.prototype, "storeSearch", null);
__decorate([
    (0, common_1.Get)('search-suggestions'),
    __param(0, (0, common_1.Query)('term')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_search_filter_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], SearchFilterController.prototype, "searchSuggestions", null);
exports.SearchFilterController = SearchFilterController = __decorate([
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_filter_service_1.SearchFilterService])
], SearchFilterController);
//# sourceMappingURL=search-filter.controller.js.map