import { Status } from 'src/common/enum/status.enum';
import { Response } from 'src/common/interceptor/response.interface';
import { ProjectService } from 'src/project/project.service';
import { BuilderService } from './builder.service';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import { Builder } from './entities/builder.entity';
export declare class BuilderController {
    private readonly builderService;
    private projectService;
    constructor(builderService: BuilderService, projectService: ProjectService);
    create(createBuilderDto: CreateBuilderDto): Promise<Response<Builder>>;
    findAll(pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<Response<{
        builders: Builder[];
        totalPages: number;
        totalBuilders: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findByOwnerId(req: any): Promise<Response<Builder[]>>;
    findOne(id: string): Promise<Response<Builder>>;
    update(id: string, updateBuilderDto: UpdateBuilderDto): Promise<Response<Builder>>;
    remove(id: string): Promise<void>;
    builderList(): Promise<{
        data: {
            value: import("mongoose").Types.ObjectId;
            label: string;
        }[];
        message: string;
    }>;
    getBuildersWithProjects(): Promise<{
        data: (import("mongoose").Document<unknown, {}, Builder, {}, {}> & Builder & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        message: string;
    }>;
    getBuilder(id: string): Promise<{
        data: {
            builder: Builder;
            projects: (import("mongoose").Document<unknown, {}, import("../project/entities/project.entity").Project, {}, {}> & import("../project/entities/project.entity").Project & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        message: string;
    }>;
    updateBuilder(req: any, updateBuilderDto: UpdateBuilderDto): Promise<Response<Builder>>;
    findOneBuilder(req: any): Promise<Response<Builder>>;
}
