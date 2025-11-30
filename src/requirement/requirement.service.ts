import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Requirement, RequirementDocument } from './entities/requirement.entity';
import {
  RequirementMatch,
  RequirementMatchDocument,
} from './entities/requirement-match.entity';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { RequirementStatus } from './enum/requirement.enum';

@Injectable()
export class RequirementService {
  constructor(
    @InjectModel(Requirement.name)
    private requirementModel: Model<RequirementDocument>,
    @InjectModel(RequirementMatch.name)
    private requirementMatchModel: Model<RequirementMatchDocument>,
  ) {}

  async create(
    userId: string,
    createRequirementDto: CreateRequirementDto,
  ): Promise<RequirementDocument> {
    const requirement = new this.requirementModel({
      ...createRequirementDto,
      user: userId,
      status: RequirementStatus.OPEN,
    });

    const savedRequirement = await requirement.save();

    // TODO: Trigger AI matching in background
    // await this.matchProperties(savedRequirement._id.toString());

    return savedRequirement;
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    propertyType?: string,
    transactionType?: string,
    location?: string,
    status?: RequirementStatus,
  ) {
    const query: any = {};

    if (propertyType) query.propertyType = propertyType;
    if (transactionType) query.transactionType = transactionType;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [requirements, total] = await Promise.all([
      this.requirementModel
        .find(query)
        .populate('user', 'name phoneNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.requirementModel.countDocuments(query),
    ]);

    return {
      requirements,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const requirement = await this.requirementModel
      .findById(id)
      .populate('user', 'name email phoneNumber')
      .exec();

    if (!requirement) {
      return null;
    }

    // Get matched properties
    const matches = await this.requirementMatchModel
      .find({ requirement: id })
      .populate('property', 'propertyTitle price thumbnail images location')
      .sort({ matchScore: -1 })
      .limit(10)
      .exec();

    return {
      ...requirement.toObject(),
      matchedProperties: matches.map((match) => ({
        ...match.property,
        matchScore: match.matchScore,
      })),
    };
  }

  async update(
    id: string,
    updateRequirementDto: UpdateRequirementDto,
  ): Promise<RequirementDocument> {
    return this.requirementModel
      .findByIdAndUpdate(id, updateRequirementDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.requirementModel.findByIdAndDelete(id);
    await this.requirementMatchModel.deleteMany({ requirement: id });
  }

  // AI-powered property matching (simplified version)
  private async matchProperties(requirementId: string): Promise<void> {
    const requirement = await this.requirementModel.findById(requirementId);
    if (!requirement) return;

    // TODO: Implement actual AI matching logic
    // For now, this is a placeholder for the matching algorithm
    // In production, this would:
    // 1. Fetch properties matching basic criteria
    // 2. Calculate match scores based on multiple factors
    // 3. Store top matches in RequirementMatch collection
    // 4. Send notification to requirement owner
  }
}
