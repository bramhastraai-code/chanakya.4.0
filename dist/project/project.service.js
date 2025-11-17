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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_entity_1 = require("./entities/project.entity");
const property_service_1 = require("../property/property.service");
const status_enum_1 = require("../common/enum/status.enum");
const customer_entity_1 = require("../customer/entities/customer.entity");
let ProjectService = class ProjectService {
    constructor(projectModel, customerModel, propertyService) {
        this.projectModel = projectModel;
        this.customerModel = customerModel;
        this.propertyService = propertyService;
    }
    async create(createProjectDto) {
        const createdProject = new this.projectModel(createProjectDto);
        return createdProject.save();
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery, status) {
        try {
            const page = parseInt(pageNumber, 10) || 1;
            const size = parseInt(pageSize, 10) || 10;
            const skip = (page - 1) * size;
            const query = {};
            if (searchQuery) {
                query.$or = [
                    { projectName: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                ];
            }
            if (status !== 'all') {
                query.status = status;
            }
            const totalProjects = await this.projectModel.countDocuments(query);
            const totalPages = Math.ceil(totalProjects / size);
            const projects = await this.projectModel
                .find(query)
                .skip(skip)
                .limit(size)
                .sort({ [sortBy]: sortOrder ? -1 : -1 })
                .populate('builder')
                .exec();
            return {
                projects: projects,
                totalProjects,
                totalPages,
                pageSize: size,
                pageNumber: page,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving projects.');
        }
    }
    async findOne(id) {
        const project = await this.projectModel
            .findById(id)
            .populate('builder')
            .populate('amenities')
            .populate('facilities')
            .populate({
            path: 'projectGroup.customer',
            strictPopulate: false,
        })
            .exec();
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async update(id, updateProjectDto) {
        const project = await this.projectModel
            .findByIdAndUpdate(id, updateProjectDto, { new: true })
            .exec();
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async remove(_id) {
        const result = await this.projectModel.findByIdAndDelete(_id).exec();
        console.log(result);
        if (!result) {
            throw new common_1.NotFoundException(`Project with ID ${_id} not found`);
        }
    }
    async ProjectList() {
        const builders = await this.projectModel.find().exec();
        const data = builders.map((project) => ({
            value: project._id,
            label: project.projectName,
        }));
        return data;
    }
    async getProjectsByCategory(category) {
        try {
            const filter = category
                ? { projectCategory: category, status: status_enum_1.Status.ACTIVE }
                : { status: status_enum_1.Status.ACTIVE };
            const projects = await this.projectModel
                .find(filter)
                .populate('builder')
                .sort({ featured: -1 })
                .exec();
            if (!projects.length) {
                throw new common_1.NotFoundException('No projects found for the given category');
            }
            console.log('getProjectsByCategory', projects[0]._id);
            return projects;
        }
        catch (error) {
            throw error;
        }
    }
    async getProjectsByAffordability(affordability, city) {
        try {
            console.log('affordability controller', city, affordability);
            const filter = { status: status_enum_1.Status.ACTIVE };
            if (affordability) {
                filter.projectAffordability = affordability;
            }
            if (city) {
                filter.city = { $regex: city, $options: 'i' };
            }
            const projects = await this.projectModel
                .find(filter)
                .populate('builder')
                .sort({ featured: -1 })
                .exec();
            console.log('getProjectsByAffordability', projects);
            if (!projects.length) {
                throw new common_1.NotFoundException('No projects found for the given criteria');
            }
            return projects;
        }
        catch (error) {
            throw error;
        }
    }
    async getProjectDetail(projectId) {
        const project = await this.projectModel
            .findById(projectId)
            .populate('builder')
            .populate({ path: 'amenities' })
            .populate({ path: 'facilities' })
            .exec();
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        const property = await this.propertyService.getPropertiesByProjectId(project._id.toString());
        console.log('property', project._id, property);
        project.properties = property;
        return {
            project,
        };
    }
    async getProjectsByCity(city) {
        const projects = await this.projectModel
            .find({ city, status: status_enum_1.Status.ACTIVE })
            .populate({
            path: 'builder',
            select: 'name logo',
        })
            .sort({ featured: -1 })
            .exec();
        if (!projects.length) {
            console.log(`No active projects found in city: ${city}`);
            return [];
        }
        return projects;
    }
    async getFormattedProjects() {
        try {
            const projects = await this.projectModel
                .aggregate([
                {
                    $match: {
                        status: status_enum_1.Status.ACTIVE,
                    },
                },
                {
                    $group: {
                        _id: {
                            city: '$city',
                            region: '$region',
                        },
                        projects: {
                            $push: {
                                _id: '$_id',
                                name: '$projectName',
                                imageURL: { $arrayElemAt: ['$images', 0] },
                                description: '$description',
                                featured: '$featured',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        city: '$_id.city',
                        region: '$_id.region',
                        projects: {
                            $sortArray: { input: '$projects', sortBy: { featured: -1 } },
                        },
                    },
                },
                {
                    $group: {
                        _id: '$city',
                        regions: {
                            $push: {
                                regionName: '$region',
                                projects: '$projects',
                            },
                        },
                    },
                },
                {
                    $project: {
                        city: '$_id',
                        regions: 1,
                        _id: 0,
                    },
                },
            ])
                .exec();
            return projects.map((city) => ({
                city: city.city,
                regions: city.regions.map((region) => ({
                    regionName: region.regionName,
                    regionImage: region.projects[0]?.imageURL || '',
                    projects: region.projects.map((project) => ({
                        projectId: project._id,
                        name: project.name,
                        imageURL: project.imageURL,
                        description: project.description,
                    })),
                })),
            }));
        }
        catch (error) {
            console.error('Error in getFormattedProjects:', error.message);
            throw error;
        }
    }
    async getUniqueCities() {
        try {
            const cities = await this.projectModel.distinct('city').exec();
            return cities;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving unique cities.');
        }
    }
    async getCityPropertyCount() {
        const result = await this.projectModel.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$city',
                    propertyCount: { $sum: 1 },
                },
            },
            { $sort: { propertyCount: -1 } },
        ]);
        return result.map((item) => ({
            city: item._id,
            propertyCount: item.propertyCount,
        }));
    }
    async getProjectsByBuilder(builderId) {
        const projects = await this.projectModel
            .find({ builder: builderId })
            .exec();
        if (!projects.length) {
            throw new common_1.NotFoundException('No projects found for this builder');
        }
        return { data: projects, message: 'builder projects fetched successfully' };
    }
    async getProjectsGroupedByBuilder() {
        const data = await this.projectModel.aggregate([
            {
                $lookup: {
                    from: 'builders',
                    localField: 'builder',
                    foreignField: '_id',
                    as: 'builderInfo',
                },
            },
            {
                $unwind: '$builderInfo',
            },
            {
                $group: {
                    _id: '$builder',
                    builderName: { $first: '$builderInfo.name' },
                    builderEmail: { $first: '$builderInfo.email' },
                    projects: {
                        $push: {
                            _id: '$_id',
                            projectName: '$projectName',
                            description: '$description',
                            priceMin: '$priceMin',
                            priceMax: '$priceMax',
                            city: '$city',
                            state: '$state',
                            status: '$status',
                            thumbnail: '$thumbnail',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    builderId: '$_id',
                    builderName: 1,
                    builderEmail: 1,
                    projects: 1,
                },
            },
        ]);
        console.log('data', data);
        return { data, message: 'Builder Projects Fetched Successfully' };
    }
    async getProjectsByKeyword(keyword) {
        try {
            const projects = await this.projectModel
                .find({
                $or: [
                    { projectName: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                ],
                status: status_enum_1.Status.ACTIVE,
            })
                .populate('builder')
                .exec();
            if (!projects.length) {
                throw new common_1.NotFoundException('No projects found for the given keyword');
            }
            return projects;
        }
        catch (error) {
            throw error;
        }
    }
    async searchProjects(keyword) {
        const results = await this.projectModel
            .find({ $text: { $search: keyword } }, { projectName: 1, _id: 1 })
            .exec();
        return results.map((project) => ({
            id: project._id.toString(),
            title: project.projectName,
        }));
    }
    async getBuilderProjects(builderId) {
        const projects = await this.projectModel
            .find({ builder: builderId, status: status_enum_1.Status.ACTIVE })
            .populate('builder')
            .exec();
        if (!projects.length) {
            throw new common_1.NotFoundException('No active projects found for this builder');
        }
        return projects;
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_entity_1.Project.name)),
    __param(1, (0, mongoose_1.InjectModel)(customer_entity_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        property_service_1.PropertyService])
], ProjectService);
//# sourceMappingURL=project.service.js.map