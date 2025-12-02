import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { ProjectAffordability, ProjectCategory } from './enum/project.enum';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PropertyService } from 'src/property/property.service';
import { Status } from 'src/common/enum/status.enum';
export declare class ProjectService {
    private projectModel;
    private readonly propertyService;
    constructor(projectModel: Model<Project>, propertyService: PropertyService);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<{
        projects: Project[];
        totalPages: number;
        totalProjects: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findProjectsByCreator(creatorId: string, pageSize: string, pageNumber: string, searchQuery?: string, status?: string): Promise<{
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
        value: import("mongoose").Types.ObjectId;
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
        data: (import("mongoose").Document<unknown, {}, Project, {}, {}> & Project & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
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
