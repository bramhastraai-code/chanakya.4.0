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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { GetProjectByAffordabilityDto, GetProjectByCategoryDto } from './dto/ProjectCategory.dto';
import { FeaturedProjectDto } from './dto/featuredProject.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { Status } from 'src/common/enum/status.enum';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto): Promise<Response<Project>>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<Response<{
        projects: Project[];
        totalPages: number;
        totalProjects: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Project>>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<Response<Project>>;
    remove(id: string): Promise<Response<Project>>;
    projectList(): Promise<Response<{
        value: string;
        label: string;
    }[]>>;
    getProjectsByCategory(getProjectByCategoryDto: GetProjectByCategoryDto): Promise<Response<FeaturedProjectDto[]>>;
    getProjectsByAffordability(getProjectByAffordabilityDto: GetProjectByAffordabilityDto): Promise<Response<FeaturedProjectDto[]>>;
    getProjectDetail(id: string): Promise<Response<ProjectDetailDto>>;
    getProjectsByCity(city: string): Promise<{
        data: Project[];
        message: string;
    }>;
    getFormattedProjects(): Promise<{
        data: any[];
        message: string;
    }>;
    getUniqueCities(): Promise<Response<string[]>>;
    getCityPropertyCount(): Promise<{
        data: {
            city: any;
            propertyCount: any;
        }[];
        message: string;
    }>;
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
    searchProjects(keyword: string): Promise<{
        data: {
            id: string;
            title: string;
        }[];
        message: string;
    }>;
    createBuilderProject(createProjectDto: CreateProjectDto): Promise<Response<Project>>;
    getProjectsByBuilderId(builderId: string): Promise<Response<Project[]>>;
    updateProject(projectId: string, updateProjectDto: UpdateProjectDto): Promise<Response<Project>>;
    deleteProject(projectId: string): Promise<Response<Project>>;
}
