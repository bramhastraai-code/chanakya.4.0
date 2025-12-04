import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferStatus } from './enum/offer.enum';
import { Project } from '../project/entities/project.entity';
import { UserRole } from '../common/enum/user-role.enum';
import { AgentBuilderAssociationService } from '../agent/services/agent-builder-association.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<Offer>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private associationService: AgentBuilderAssociationService,
  ) {}

  /**
   * Create new offer for project
   */
  async create(user: any, dto: CreateOfferDto) {
    // If Builder, validate they own the project
    if (user.role === UserRole.BUILDER) {
      const project = await this.projectModel.findById(dto.projectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.builder?.toString() !== user.userId.toString()) {
        throw new ForbiddenException(
          'You can only create offers for your own projects',
        );
      }
    }
    // If Admin, allow offer creation for any project

    return this.offerModel.create({
      ...dto,
      project: new Types.ObjectId(dto.projectId),
      createdBy: user.userId,
      status: OfferStatus.ACTIVE,
    });
  }

  /**
   * Get all offers with filters (Admin/Builder)
   */
  async findAll(filters: any = {}) {
    const { projectId, builderId, status, page = 1, limit = 20 } = filters;
    const query: any = {};

    if (projectId) query.project = new Types.ObjectId(projectId);
    if (status) query.status = status;

    // If builderId is provided, find projects by that builder
    if (builderId) {
      const builderProjects = await this.projectModel
        .find({ builder: new Types.ObjectId(builderId) })
        .select('_id');
      query.project = { $in: builderProjects.map((p) => p._id) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [offers, total] = await Promise.all([
      this.offerModel
        .find(query)
        .populate('project', 'projectName location builder thumbnail')
        .populate('createdBy', 'name companyName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.offerModel.countDocuments(query),
    ]);

    return {
      offers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get offers visible to an agent (only for associated projects)
   */
  async findAllForAgent(agentId: string, filters: any = {}) {
    const { status, page = 1, limit = 20 } = filters;

    // Get agent's associated projects
    const associations =
      await this.associationService.getAgentAssociations(agentId);
    const projectIds = associations.map((a: any) => a.projectId);

    if (projectIds.length === 0) {
      return {
        offers: [],
        pagination: {
          total: 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: 0,
        },
      };
    }

    const query: any = {
      project: { $in: projectIds },
    };

    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [offers, total] = await Promise.all([
      this.offerModel
        .find(query)
        .populate('project', 'projectName location builder thumbnail')
        .populate('createdBy', 'name companyName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.offerModel.countDocuments(query),
    ]);

    return {
      offers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get single offer by ID
   */
  async findOne(id: string, user?: any) {
    const offer = await this.offerModel
      .findById(id)
      .populate('project', 'projectName location builder thumbnail')
      .populate('createdBy', 'name companyName')
      .exec();

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    // If agent, check if they have access to this project
    if (user && user.role === UserRole.AGENT) {
      const hasAccess = await this.associationService.isAgentAssociated(
        user.userId,
        offer.project['builder']?.toString(),
        offer.project['_id']?.toString(),
      );

      if (!hasAccess) {
        throw new ForbiddenException('You do not have access to this offer');
      }
    }

    return offer;
  }

  /**
   * Update offer
   */
  async update(id: string, user: any, dto: UpdateOfferDto) {
    const offer = await this.offerModel.findById(id);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    // Only builder who created it or admin can update
    if (
      user.role === UserRole.BUILDER &&
      offer.createdBy.toString() !== user.userId.toString()
    ) {
      throw new ForbiddenException('You can only update your own offers');
    }

    Object.assign(offer, dto);
    return offer.save();
  }

  /**
   * Delete offer
   */
  async remove(id: string, user: any) {
    const offer = await this.offerModel.findById(id);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    // Only builder who created it or admin can delete
    if (
      user.role === UserRole.BUILDER &&
      offer.createdBy.toString() !== user.userId.toString()
    ) {
      throw new ForbiddenException('You can only delete your own offers');
    }

    await this.offerModel.findByIdAndDelete(id);
    return { message: 'Offer deleted successfully' };
  }

  /**
   * Get offers by project
   */
  async findByProject(projectId: string, filters: any = {}) {
    const { status, page = 1, limit = 20 } = filters;
    const query: any = { project: new Types.ObjectId(projectId) };

    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [offers, total] = await Promise.all([
      this.offerModel
        .find(query)
        .populate('createdBy', 'name companyName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.offerModel.countDocuments(query),
    ]);

    return {
      offers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Check and update expired offers
   */
  async updateExpiredOffers() {
    const now = new Date();
    const result = await this.offerModel.updateMany(
      {
        status: { $ne: OfferStatus.EXPIRED },
        validUntil: { $lt: now },
      },
      {
        status: OfferStatus.EXPIRED,
      },
    );

    return {
      message: 'Expired offers updated',
      count: result.modifiedCount,
    };
  }
}
