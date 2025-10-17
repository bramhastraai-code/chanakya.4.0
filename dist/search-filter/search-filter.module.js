"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchFilterModule = void 0;
const common_1 = require("@nestjs/common");
const search_filter_service_1 = require("./search-filter.service");
const search_filter_controller_1 = require("./search-filter.controller");
const property_entity_1 = require("../property/entities/property.entity");
const mongoose_1 = require("@nestjs/mongoose");
const customer_entity_1 = require("../customer/entities/customer.entity");
const amenity_entity_1 = require("../amenity/entities/amenity.entity");
const project_entity_1 = require("../project/entities/project.entity");
const search_record_entity_1 = require("./entity/search-record.entity");
let SearchFilterModule = class SearchFilterModule {
};
exports.SearchFilterModule = SearchFilterModule;
exports.SearchFilterModule = SearchFilterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: search_record_entity_1.SearchRecord.name, schema: search_record_entity_1.SearchRecordSchema },
                { name: property_entity_1.Property.name, schema: property_entity_1.PropertySchema },
                { name: project_entity_1.Project.name, schema: project_entity_1.ProjectSchema },
                { name: customer_entity_1.Customer.name, schema: customer_entity_1.CustomerSchema },
                { name: amenity_entity_1.Amenity.name, schema: amenity_entity_1.AmenitySchema },
            ]),
        ],
        controllers: [search_filter_controller_1.SearchFilterController],
        providers: [search_filter_service_1.SearchFilterService],
    })
], SearchFilterModule);
//# sourceMappingURL=search-filter.module.js.map