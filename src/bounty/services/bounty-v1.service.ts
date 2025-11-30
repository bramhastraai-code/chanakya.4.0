import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bounty } from '../entities/bounty.entity';
import { BountySubmission } from '../entities/bounty-submission.entity';
import { WalletV1Service } from '../../wallet/services/wallet-v1.service';
import {
  CreateBountyDto,
  UpdateBountyDto,
  SubmitBountyDto,
} from '../dto/v1/bounty.dto';
import { BountyStatus, SubmissionStatus } from '../enum/bounty.enum';
import { TransactionType } from '../../wallet/enum/transaction.enum';

@Injectable()
export class BountyV1Service {
  constructor(
    @InjectModel(Bounty.name) private bountyModel: Model<Bounty>,
    @InjectModel(BountySubmission.name)
    private submissionModel: Model<BountySubmission>,
    private readonly walletService: WalletV1Service,
  ) {}

  /**
   * Create new bounty program
   */
  async create(adminId: Types.ObjectId, dto: CreateBountyDto) {
    return this.bountyModel.create({
      ...dto,
      createdBy: adminId,
      status: BountyStatus.ACTIVE,
    });
  }

  /**
   * Get active bounties
   */
  async findAllActive() {
    return this.bountyModel
      .find({ status: BountyStatus.ACTIVE })
      .sort({ createdAt: -1 })
      .exec();
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
      await this.walletService.credit(
        submission.userId,
        bounty.rewardAmount,
        TransactionType.BOUNTY_REWARD,
        `Reward for: ${bounty.title}`,
        { submissionId: submission._id, bountyId: bounty['_id'] },
      );
    }

    return submission;
  }
}
