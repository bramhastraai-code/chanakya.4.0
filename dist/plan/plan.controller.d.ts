import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Response } from 'src/common/interceptor/response.interface';
export declare class PlanController {
    private readonly planService;
    constructor(planService: PlanService);
    create(createPlanDto: CreatePlanDto): Promise<Response<Plan>>;
    update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<Response<{
        plans: Plan[];
        totalPages: number;
        totalPlans: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Plan>>;
    remove(id: string): Promise<{
        data: string;
        message: string;
    }>;
    findPlansByProductTypeAndStatus(planType: string): Promise<Response<Plan[]>>;
}
