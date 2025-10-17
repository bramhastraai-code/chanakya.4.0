import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<PlanDocument>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    try {
      const createdPlan = new this.planModel(createPlanDto);
      return createdPlan.save();
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan | null> {
    const updatedPlan = await this.planModel.findByIdAndUpdate(
      id,
      updatePlanDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedPlan) {
      throw new NotFoundException('Plan not found');
    }
    return updatedPlan;
  }

  async findAll(
    pageSize: string = '10',
    pageNumber: string = '1',
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string,
  ): Promise<{
    plans: Plan[];
    totalPages: number;
    totalPlans: number;
    pageSize: number;
    pageNumber: number;
  }> {
    const limit = parseInt(pageSize, 10);
    const skip = (parseInt(pageNumber, 10) - 1) * limit;

    const query = searchQuery
      ? {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { productType: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    const plans = await this.planModel
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const totalPlans = await this.planModel.countDocuments(query);
    const totalPages = Math.ceil(totalPlans / limit);

    return {
      plans,
      totalPages,
      totalPlans,
      pageSize: limit,
      pageNumber: parseInt(pageNumber, 10),
    };
  }

  async findOne(id: string): Promise<Plan | null> {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    const result = await this.planModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Plan not found');
    }
    return result;
  }
  // for web ----------------------------------------------------------------------------
  async findByProductTypeAndStatus(planType: string): Promise<Plan[]> {
    const plans = await this.planModel.find({ productType: planType }).exec();
    if (!plans || plans.length === 0) {
      throw new NotFoundException('No plans found matching the criteria');
    }
    return plans;
  }
}
