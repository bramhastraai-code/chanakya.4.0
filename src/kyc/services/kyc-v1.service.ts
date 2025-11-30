import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { KycSubmission } from '../entities/kyc-submission.entity';
import { KycDocument } from '../entities/kyc-document.entity';
import { SubmitKycDto, KycDocumentDto } from '../dto/v1/kyc.dto';
import { KycStatus, DocumentStatus } from '../enum/kyc.enum';

@Injectable()
export class KycV1Service {
  constructor(
    @InjectModel(KycSubmission.name)
    private submissionModel: Model<KycSubmission>,
    @InjectModel(KycDocument.name) private documentModel: Model<KycDocument>,
  ) {}

  /**
   * Submit KYC documents
   */
  async submitKyc(userId: Types.ObjectId, dto: SubmitKycDto) {
    // Check if pending submission exists
    const existing = await this.submissionModel.findOne({
      userId,
      status: KycStatus.PENDING,
    });

    if (existing) {
      throw new BadRequestException(
        'You already have a pending KYC submission',
      );
    }

    // Create submission
    const submission = await this.submissionModel.create({
      userId,
      status: KycStatus.PENDING,
      submittedAt: new Date(),
    });

    // Create documents
    const documents = await Promise.all(
      dto.documents.map((doc) =>
        this.documentModel.create({
          kycSubmission: submission._id,
          type: doc.type,
          number: doc.number,
          frontImageUrl: doc.frontImageUrl,
          backImageUrl: doc.backImageUrl,
          status: DocumentStatus.PENDING,
        }),
      ),
    );

    return {
      submission,
      documents,
    };
  }

  /**
   * Get KYC status
   */
  async getStatus(userId: Types.ObjectId) {
    const submission = await this.submissionModel
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!submission) {
      return { status: KycStatus.NOT_SUBMITTED };
    }

    const documents = await this.documentModel.find({
      kycSubmission: submission._id,
    });

    return {
      ...submission.toObject(),
      documents,
    };
  }

  /**
   * Admin: Get pending submissions
   */
  async getPendingSubmissions(filters: any = {}) {
    const { page = 1, limit = 20 } = filters;
    const skip = (Number(page) - 1) * Number(limit);

    const [submissions, total] = await Promise.all([
      this.submissionModel
        .find({ status: KycStatus.PENDING })
        .populate('userId', 'name email phoneNumber')
        .sort({ submittedAt: 1 }) // Oldest first
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.submissionModel.countDocuments({ status: KycStatus.PENDING }),
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
   * Admin: Get submission details
   */
  async getSubmission(id: string) {
    const submission = await this.submissionModel
      .findById(id)
      .populate('userId', 'name email phoneNumber');

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const documents = await this.documentModel.find({ kycSubmission: id });

    return {
      submission,
      documents,
    };
  }

  /**
   * Admin: Review submission
   */
  async reviewSubmission(
    id: string,
    adminId: Types.ObjectId,
    approved: boolean,
    rejectionReason?: string,
  ) {
    const submission = await this.submissionModel.findById(id);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.status !== KycStatus.PENDING) {
      throw new BadRequestException('Submission is already reviewed');
    }

    submission.status = approved ? KycStatus.APPROVED : KycStatus.REJECTED;
    submission.reviewedBy = adminId;

    if (approved) {
      submission.approvedAt = new Date();
    } else {
      submission.rejectedAt = new Date();
      submission.rejectionReason = rejectionReason;
    }

    await submission.save();

    // Update documents status
    await this.documentModel.updateMany(
      { kycSubmission: id },
      {
        status: approved ? DocumentStatus.APPROVED : DocumentStatus.REJECTED,
      },
    );

    return submission;
  }
}
