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
