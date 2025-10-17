/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { ProjectAffordability, ProjectCategory } from './enum/project.enum';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PropertyService } from 'src/property/property.service';
import { Status } from 'src/common/enum/status.enum';
import { Customer } from 'src/customer/entities/customer.entity';
export declare class ProjectService {
    private projectModel;
    private customerModel;
    private readonly propertyService;
    constructor(projectModel: Model<Project>, customerModel: Model<Customer>, propertyService: PropertyService);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<{
        projects: Project[];
        totalPages: number;
        totalProjects: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Project>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(_id: string): Promise<any>;
    ProjectList(): Promise<{
        value: string;
        label: string;
    }[]>;
    getProjectsByCategory(category?: ProjectCategory): Promise<any[]>;
    getProjectsByAffordability(affordability?: ProjectAffordability, city?: string): Promise<any[]>;
    getProjectDetail(projectId: string): Promise<any>;
    getProjectsByCity(city: string): Promise<Project[]>;
    getFormattedProjects(): Promise<any[]>;
    getUniqueCities(): Promise<string[]>;
    getCityPropertyCount(): Promise<{
        city: any;
        propertyCount: any;
    }[]>;
    getProjectsByBuilder(builderId: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, Project> & Project & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        message: string;
    }>;
    getProjectsGroupedByBuilder(): Promise<{
        data: any[];
        message: string;
    }>;
    getProjectsByKeyword(keyword: string): Promise<Project[]>;
    searchProjects(keyword: string): Promise<{
        id: string;
        title: string;
    }[]>;
    getBuilderProjects(builderId: string): Promise<Project[]>;
}
