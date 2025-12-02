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
const create_search_filter_dto_1 = require("./dto/create-search-filter.dto");
let SearchFilterController = class SearchFilterController {
    constructor(searchFilterService) {
        this.searchFilterService = searchFilterService;
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
    (0, common_1.Get)('search-suggestions'),
    __param(0, (0, common_1.Query)('term')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_search_filter_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], SearchFilterController.prototype, "searchSuggestions", null);
exports.SearchFilterController = SearchFilterController = __decorate([
    (0, common_1.Controller)('search'),
    (0, swagger_1.ApiTags)('search-filter'),
    __metadata("design:paramtypes", [search_filter_service_1.SearchFilterService])
], SearchFilterController);
//# sourceMappingURL=search-filter.controller.js.map