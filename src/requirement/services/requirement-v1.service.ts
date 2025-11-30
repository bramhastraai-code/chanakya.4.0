import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Requirement } from '../entities/requirement.entity';
import { RequirementMatch } from '../entities/requirement-match.entity';
import { Property } from '../../property/entities/property.entity';
import {
  CreateRequirementDto,
  UpdateRequirementDto,
} from '../dto/v1/requirement.dto';
import { RequirementStatus } from '../enum/requirement.enum';

@Injectable()
export class RequirementV1Service {
  constructor(
    @InjectModel(Requirement.name) private requirementModel: Model<Requirement>,
    @InjectModel(RequirementMatch.name)
    private matchModel: Model<RequirementMatch>,
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  /**
   * Create new requirement
   */
  async create(userId: Types.ObjectId, dto: CreateRequirementDto) {
    const requirement = await this.requirementModel.create({
      ...dto,
      userId,
      status: RequirementStatus.OPEN,
    });

    // Trigger async matching
    this.findMatches(requirement._id);

    return requirement;
  }

  /**
   * Find matches for a requirement
   */
  async findMatches(requirementId: Types.ObjectId) {
    const requirement = await this.requirementModel.findById(requirementId);
    if (!requirement) return;

    // Build query for properties
    const query: any = {
      approvalStatus: 'approved',
      propertyType: requirement.propertyType,
      // Location match (simple regex for now)
      $or: [
        { city: { $regex: requirement.location, $options: 'i' } },
        { address: { $regex: requirement.location, $options: 'i' } },
      ],
    };

    // Price range match
    if (requirement.priceMin || requirement.priceMax) {
      query.price = {};
      if (requirement.priceMin) query.price.$gte = requirement.priceMin;
      if (requirement.priceMax) query.price.$lte = requirement.priceMax;
    }

    // Configuration match
    if (requirement.configuration) {
      query.bhkConfiguration = requirement.configuration;
    }

    const properties = await this.propertyModel.find(query).limit(20).exec();

    // Save matches
    for (const property of properties) {
      await this.matchModel.findOneAndUpdate(
        { requirement: requirement._id, property: property._id },
        {
          requirement: requirement._id,
          property: property._id,
          matchScore: 100, // Simplified score for now
          matchedAt: new Date(),
        },
        { upsert: true },
      );
    }
  }

  /**
   * Get matches for a requirement
   */
  async getMatches(requirementId: string, userId: Types.ObjectId) {
    const requirement = await this.requirementModel.findById(requirementId);

    if (!requirement) {
      throw new NotFoundException('Requirement not found');
    }

    if (requirement.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('Access denied');
    }

    return this.matchModel
      .find({ requirement: requirementId })
      .populate('property')
      .sort({ matchScore: -1 })
      .exec();
  }

  /**
   * Get my requirements
   */
  async findMyRequirements(userId: Types.ObjectId, status?: RequirementStatus) {
    const query: any = { userId };
    if (status) query.status = status;

    return this.requirementModel.find(query).sort({ createdAt: -1 }).exec();
  }

  /**
   * Search requirements (for agents)
   */
  async search(filters: any) {
    const {
      location,
      propertyType,
      minBudget,
      maxBudget,
      page = 1,
      limit = 20,
    } = filters;

    const query: any = { status: RequirementStatus.OPEN };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minBudget || maxBudget) {
      query.$or = [
        { priceMin: { $gte: minBudget || 0 } },
        { priceMax: { $lte: maxBudget || Number.MAX_SAFE_INTEGER } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [requirements, total] = await Promise.all([
      this.requirementModel
        .find(query)
        .populate('userId', 'name') // Only show name, hide contact info
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.requirementModel.countDocuments(query),
    ]);

    return {
      requirements,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Update requirement
   */
  async update(id: string, userId: Types.ObjectId, dto: UpdateRequirementDto) {
    const requirement = await this.requirementModel.findById(id);

    if (!requirement) {
      throw new NotFoundException('Requirement not found');
    }

    if (requirement.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('Access denied');
    }

    Object.assign(requirement, dto);
    const updated = await requirement.save();

    // Re-run matching if critical fields changed
    if (dto.location || dto.priceMin || dto.priceMax || dto.propertyType) {
      this.findMatches(updated._id);
    }

    return updated;
  }

  /**
   * Delete requirement
   */
  async delete(id: string, userId: Types.ObjectId) {
    const requirement = await this.requirementModel.findById(id);

    if (!requirement) {
      throw new NotFoundException('Requirement not found');
    }

    if (requirement.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('Access denied');
    }

    await this.requirementModel.findByIdAndDelete(id);
    await this.matchModel.deleteMany({ requirement: id });

    return { message: 'Requirement deleted successfully' };
  }
}
