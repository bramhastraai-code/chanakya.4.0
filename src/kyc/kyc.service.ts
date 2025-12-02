import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { KycSubmission } from './entities/kyc-submission.entity';
import { KycDocument } from './entities/kyc-document.entity';
import { SubmitKycDto } from './dto/kyc.dto';
import { KycStatus, DocumentStatus, DocumentType } from './enums/kyc.enum';

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
  async submitKyc(userId: Types.ObjectId | string, dto: SubmitKycDto) {
    // Convert string to ObjectId if needed
    const userObjectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Check if pending submission exists
    const existing = await this.submissionModel.findOne({
      userId: userObjectId,
      status: KycStatus.PENDING,
    });

    if (existing) {
      throw new BadRequestException(
        'You already have a pending KYC submission',
      );
    }

    // Create submission with personal details
    const submission = await this.submissionModel.create({
      userId: userObjectId,
      fullName: dto.fullName,
      panNumber: dto.panNumber,
      aadharNumber: dto.aadharNumber,
      address: dto.address,
      status: KycStatus.PENDING,
      submittedAt: new Date(),
    });

    // Create document records for each uploaded document
    const documents = await Promise.all([
      // PAN Card
      this.documentModel.create({
        kycSubmission: submission._id,
        type: DocumentType.PAN,
        number: dto.panNumber,
        frontImageUrl: dto.panCardImageUrl,
        status: DocumentStatus.PENDING,
      }),
      // Aadhar Card Front
      this.documentModel.create({
        kycSubmission: submission._id,
        type: DocumentType.AADHAAR,
        number: dto.aadharNumber,
        frontImageUrl: dto.aadharCardFrontImageUrl,
        backImageUrl: dto.aadharCardBackImageUrl,
        status: DocumentStatus.PENDING,
      }),
      // Profile Photo
      this.documentModel.create({
        kycSubmission: submission._id,
        type: DocumentType.PROFILE_PHOTO,
        frontImageUrl: dto.profilePhotoUrl,
        status: DocumentStatus.PENDING,
      }),
    ]);

    return {
      submission,
      documents,
    };
  }

  /**
   * Update KYC documents
   */
  async updateKyc(userId: Types.ObjectId | string, dto: Partial<SubmitKycDto>) {
    // Convert string to ObjectId if needed
    const userObjectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const submission = await this.submissionModel.findOne({
      userId: userObjectId,
    });

    if (!submission) {
      throw new NotFoundException('KYC submission not found');
    }

    if (submission.status === KycStatus.APPROVED) {
      throw new BadRequestException('Cannot update approved KYC');
    }

    // Update personal details if provided
    if (dto.fullName) submission.fullName = dto.fullName;
    if (dto.panNumber) submission.panNumber = dto.panNumber;
    if (dto.aadharNumber) submission.aadharNumber = dto.aadharNumber;
    if (dto.address) submission.address = dto.address;

    // If rejected, reset status to pending on update
    if (submission.status === KycStatus.REJECTED) {
      submission.status = KycStatus.PENDING;
      submission.submittedAt = new Date();
      submission.rejectionReason = undefined;
      submission.rejectedAt = undefined;
      submission.reviewedBy = undefined;
    }

    await submission.save();

    // Update documents if provided
    const documentUpdates = [];

    if (dto.panCardImageUrl) {
      documentUpdates.push(
        this.documentModel.findOneAndUpdate(
          { kycSubmission: submission._id, type: DocumentType.PAN },
          {
            frontImageUrl: dto.panCardImageUrl,
            status: DocumentStatus.PENDING,
            number: dto.panNumber || submission.panNumber,
          },
          { upsert: true, new: true },
        ),
      );
    }

    if (dto.aadharCardFrontImageUrl || dto.aadharCardBackImageUrl) {
      const update: any = {
        status: DocumentStatus.PENDING,
        number: dto.aadharNumber || submission.aadharNumber,
      };
      if (dto.aadharCardFrontImageUrl)
        update.frontImageUrl = dto.aadharCardFrontImageUrl;
      if (dto.aadharCardBackImageUrl)
        update.backImageUrl = dto.aadharCardBackImageUrl;

      documentUpdates.push(
        this.documentModel.findOneAndUpdate(
          { kycSubmission: submission._id, type: DocumentType.AADHAAR },
          update,
          { upsert: true, new: true },
        ),
      );
    }

    if (dto.profilePhotoUrl) {
      documentUpdates.push(
        this.documentModel.findOneAndUpdate(
          { kycSubmission: submission._id, type: DocumentType.PROFILE_PHOTO },
          {
            frontImageUrl: dto.profilePhotoUrl,
            status: DocumentStatus.PENDING,
          },
          { upsert: true, new: true },
        ),
      );
    }

    const documents = await Promise.all(documentUpdates);

    // If no specific document updates but we have documents, fetch them to return
    const allDocuments = await this.documentModel.find({
      kycSubmission: submission._id,
    });

    return {
      submission,
      documents: allDocuments,
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
