import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bounty } from './entities/bounty.entity';
import {
  CreateBountyDto,
  SubmitBountyDto,
  UpdateBountyDto,
} from './dto/bounty.dto';
import { BountySubmission } from './entities/bounty-submission.entity';
import { BountyStatus, SubmissionStatus } from './enum/bounty.enum';
import { WalletService } from 'src/wallet/wallet.service';
import { Project } from 'src/project/entities/project.entity';
import { UserRole } from 'src/common/enum/user-role.enum';
import { AgentBuilderAssociationService } from '../agent/services/agent-builder-association.service';

@Injectable()
export class BountyService {
  constructor(
    @InjectModel(Bounty.name) private bountyModel: Model<Bounty>,
    @InjectModel(BountySubmission.name)
    private submissionModel: Model<BountySubmission>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly walletService: WalletService,
    private readonly associationService: AgentBuilderAssociationService,
  ) {}

  /**
   * Create new bounty program
   */
  async create(user: any, dto: CreateBountyDto) {
    // If Builder, validate they own the project
    if (user.role === UserRole.BUILDER) {
      const project = await this.projectModel.findById(dto.projectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.builder?.toString() !== user.userId.toString()) {
        throw new ForbiddenException(
          'You can only create bounties for your own projects',
        );
      }
    }
    // If Admin, allow bounty creation for any project

    return this.bountyModel.create({
      ...dto,
      project: new Types.ObjectId(dto.projectId),
      createdBy: user.userId,
      status: BountyStatus.ACTIVE,
    });
  }

  /**
   * Get all bounties with filters
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

    const [bounties, total] = await Promise.all([
      this.bountyModel
        .find(query)
        .populate('project', 'title location builder')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.bountyModel.countDocuments(query),
    ]);

    return {
      bounties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get single bounty by ID
   */
  async findOne(id: string) {
    const bounty = await this.bountyModel
      .findById(id)
      .populate('project', 'title location builder');

    if (!bounty) {
      throw new NotFoundException('Bounty not found');
    }

    return bounty;
  }

  /**
   * Update bounty
   */
  async update(id: string, dto: UpdateBountyDto, user: any) {
    const bounty = await this.bountyModel.findById(id).populate('project');

    if (!bounty) {
      throw new NotFoundException('Bounty not found');
    }

    // If Builder, validate they own the project
    if (user.role === UserRole.BUILDER) {
      const project = bounty.project as any;
      if (project.builder?.toString() !== user.userId.toString()) {
        throw new ForbiddenException(
          'You can only update bounties for your own projects',
        );
      }
    }

    Object.assign(bounty, dto);
    return bounty.save();
  }

  /**
   * Delete bounty
   */
  async remove(id: string, user: any) {
    const bounty = await this.bountyModel.findById(id).populate('project');

    if (!bounty) {
      throw new NotFoundException('Bounty not found');
    }

    // If Builder, validate they own the project
    if (user.role === UserRole.BUILDER) {
      const project = bounty.project as any;
      if (project.builder?.toString() !== user.userId.toString()) {
        throw new ForbiddenException(
          'You can only delete bounties for your own projects',
        );
      }
    }

    await this.bountyModel.findByIdAndDelete(id);
    return { deleted: true };
  }

  /**
   * Get active bounties (all - public access)
   */
  async findAllActive(projectId?: string) {
    const query: any = { status: BountyStatus.ACTIVE };
    if (projectId) {
      query.project = new Types.ObjectId(projectId);
    }
    return this.bountyModel
      .find(query)
      .populate('project', 'projectName location builder thumbnail')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Get bounties visible to an agent (only for associated builders/projects)
   */
  async findAllForAgent(agentId: string, filters: any = {}) {
    const { status = BountyStatus.ACTIVE, page = 1, limit = 20 } = filters;

    // Get agent's associated projects
    const associations =
      await this.associationService.getAgentAssociations(agentId);
    const projectIds = associations.map((a: any) => a.projectId);

    if (projectIds.length === 0) {
      return {
        bounties: [],
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
      status,
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [bounties, total] = await Promise.all([
      this.bountyModel
        .find(query)
        .populate('project', 'projectName location builder thumbnail')
        .populate('createdBy', 'name companyName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.bountyModel.countDocuments(query),
    ]);

    return {
      bounties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Submit a claim/referral
   */
  async submit(userId: Types.ObjectId, dto: SubmitBountyDto) {
    const bounty = await this.bountyModel.findById(dto.bountyId);

    if (!bounty) {
      throw new NotFoundException('Bounty not found');
    }

    if (bounty.status !== BountyStatus.ACTIVE) {
      throw new BadRequestException('This bounty program is not active');
    }

    if (bounty.expiryDate && new Date() > bounty.expiryDate) {
      throw new BadRequestException('This bounty program has expired');
    }

    return this.submissionModel.create({
      bounty: dto.bountyId,
      userId,
      submissionData: dto.submissionData,
      status: SubmissionStatus.PENDING,
    });
  }

  /**
   * Get my submissions
   */
  async getMySubmissions(userId: Types.ObjectId) {
    return this.submissionModel
      .find({ userId })
      .populate('bounty', 'title rewardAmount type')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Admin: Get all submissions
   */
  async getAllSubmissions(filters: any = {}) {
    const { status, bountyId, page = 1, limit = 20 } = filters;
    const query: any = {};

    if (status) query.status = status;
    if (bountyId) query.bounty = bountyId;

    const skip = (Number(page) - 1) * Number(limit);

    const [submissions, total] = await Promise.all([
      this.submissionModel
        .find(query)
        .populate('bounty', 'title rewardAmount')
        .populate('userId', 'email name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.submissionModel.countDocuments(query),
    ]);

    return {
      submissions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Admin: Review submission (Approve/Reject)
   */
  async reviewSubmission(
    submissionId: string,
    adminId: Types.ObjectId,
    approved: boolean,
    feedback?: string,
  ) {
    const submission = await this.submissionModel
      .findById(submissionId)
      .populate('bounty');

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.status !== SubmissionStatus.PENDING) {
      throw new BadRequestException('Submission is already reviewed');
    }

    submission.status = approved
      ? SubmissionStatus.APPROVED
      : SubmissionStatus.REJECTED;
    submission.adminFeedback = feedback;
    submission.reviewedBy = adminId;
    submission.reviewedAt = new Date();
    await submission.save();

    // If approved, credit wallet
    if (approved) {
      const bounty = submission.bounty as unknown as Bounty;
      await this.walletService.creditWallet(
        submission.userId.toString(),
        bounty.rewardAmount,
        `Reward for: ${bounty.title}`,
        undefined,
        bounty['_id']?.toString(),
      );
    }

    return submission;
  }
}
