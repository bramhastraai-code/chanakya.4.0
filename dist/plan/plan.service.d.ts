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
import { Plan, PlanDocument } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
export declare class PlanService {
    private readonly planModel;
    constructor(planModel: Model<PlanDocument>);
    create(createPlanDto: CreatePlanDto): Promise<Plan>;
    update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan | null>;
    findAll(pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<{
        plans: Plan[];
        totalPages: number;
        totalPlans: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Plan | null>;
    remove(id: string): Promise<{
        deletedCount: number;
    }>;
    findByProductTypeAndStatus(planType: string): Promise<Plan[]>;
}
