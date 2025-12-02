import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { ProjectCategory } from './enum/project.enum';
import { GetProjectByAffordabilityDto, GetProjectByCategoryDto } from './dto/ProjectCategory.dto';
import { FeaturedProjectDto } from './dto/featuredProject.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { Status } from 'src/common/enum/status.enum';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto, user: any): Promise<Response<Project>>;
    getProjectsByCreator(user: any, pageSize: string, pageNumber: string, searchQuery?: string, status?: string): Promise<Response<{
        projects: Project[];
        totalPages: number;
        totalProjects: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    getProjectsWithActiveBounties(): Promise<{
        success: boolean;
        message: string;
        data: Project[];
    }>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<Response<{
        projects: Project[];
        totalPages: number;
        totalProjects: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Project>>;
    update(id: string, updateProjectDto: UpdateProjectDto, user: any): Promise<Response<Project>>;
    remove(id: string): Promise<Response<Project>>;
    projectList(): Promise<{
        data: {
            value: import("mongoose").Types.ObjectId;
            label: string;
        }[];
        message: string;
    }>;
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
    searchProjects(keyword: string): Promise<{
        data: {
            id: string;
            title: string;
        }[];
        message: string;
    }>;
    createBuilderProject(createProjectDto: CreateProjectDto, user: any): Promise<Response<Project>>;
    getProjectsByBuilderId(builderId: string): Promise<Response<Project[]>>;
    updateProject(projectId: string, updateProjectDto: UpdateProjectDto, user: any): Promise<Response<Project>>;
    deleteProject(projectId: string): Promise<Response<Project>>;
    getPublicProjects(pageSize?: string, pageNumber?: string, city?: string, category?: ProjectCategory): Promise<Response<{
        projects: Project[];
        totalPages: number;
        totalProjects: number;
        pageSize: number;
        pageNumber: number;
    }>>;
}
