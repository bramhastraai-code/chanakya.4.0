import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KycSubmission, KycSubmissionDocument } from './entities/kyc-submission.entity';
import { KycDocument, KycDocumentDocument } from './entities/kyc-document.entity';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { KycStatus, DocumentStatus } from './enum/kyc.enum';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(KycSubmission.name)
    private kycSubmissionModel: Model<KycSubmissionDocument>,
    @InjectModel(KycDocument.name)
    private kycDocumentModel: Model<KycDocumentDocument>,
  ) {}

  async getStatus(userId: string) {
    const submission = await this.kycSubmissionModel
      .findOne({ user: userId })
      .sort({ createdAt: -1 })
      .exec();

    if (!submission) {
      return {
        status: KycStatus.NOT_SUBMITTED,
        submittedAt: null,
        approvedAt: null,
        documents: [],
        rejectionReason: null,
      };
    }

    const documents = await this.kycDocumentModel
      .find({ kycSubmission: submission._id })
      .exec();

    return {
      status: submission.status,
      submittedAt: submission.submittedAt,
      approvedAt: submission.approvedAt,
      rejectedAt: submission.rejectedAt,
      documents: documents.map((doc) => ({
        type: doc.type,
        status: doc.status,
        number: doc.number.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3'), // Mask sensitive data
      })),
      rejectionReason: submission.rejectionReason,
    };
  }

  async submit(userId: string, submitKycDto: SubmitKycDto) {
    // Check if there's already a pending or approved submission
    const existingSubmission = await this.kycSubmissionModel
      .findOne({
        user: userId,
        status: { $in: [KycStatus.PENDING, KycStatus.APPROVED] },
      })
      .exec();

    if (existingSubmission) {
      throw new BadRequestException(
        'You already have a pending or approved KYC submission',
      );
    }

    // Create new submission
    const submission = new this.kycSubmissionModel({
      user: userId,
      status: KycStatus.PENDING,
      submittedAt: new Date(),
    });

    const savedSubmission = await submission.save();

    // Create documents
    const documentPromises = submitKycDto.documents.map((doc) => {
      const kycDoc = new this.kycDocumentModel({
        kycSubmission: savedSubmission._id,
        type: doc.type,
        number: doc.number,
        frontImageUrl: doc.frontImage,
        backImageUrl: doc.backImage,
        status: DocumentStatus.PENDING,
      });
      return kycDoc.save();
    });

    // Add address proof if provided
    if (submitKycDto.addressProof) {
      const addressProofDoc = new this.kycDocumentModel({
        kycSubmission: savedSubmission._id,
        type: 'address_proof',
        number: 'N/A',
        frontImageUrl: submitKycDto.addressProof.image,
        status: DocumentStatus.PENDING,
      });
      documentPromises.push(addressProofDoc.save());
    }

    await Promise.all(documentPromises);

    return {
      status: KycStatus.PENDING,
      submittedAt: savedSubmission.submittedAt,
      estimatedVerificationTime: '24-48 hours',
    };
  }

  async getPendingSubmissions(page: number = 1, limit: number = 20) {
    const query = { status: KycStatus.PENDING };
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      this.kycSubmissionModel
        .find(query)
        .populate('user', 'name email phoneNumber')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.kycSubmissionModel.countDocuments(query),
    ]);

    // Get documents for each submission
    const submissionsWithDocs = await Promise.all(
      submissions.map(async (submission) => {
        const documents = await this.kycDocumentModel
          .find({ kycSubmission: submission._id })
          .exec();

        return {
          ...submission.toObject(),
          documents,
        };
      }),
    );

    return {
      submissions: submissionsWithDocs,
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

  async approve(submissionId: string, adminId: string) {
    const submission = await this.kycSubmissionModel.findById(submissionId);

    if (!submission) {
      throw new NotFoundException('KYC submission not found');
    }

    if (submission.status !== KycStatus.PENDING) {
      throw new BadRequestException('KYC submission is not pending');
    }

    submission.status = KycStatus.APPROVED;
    submission.approvedAt = new Date();
    submission.reviewedBy = adminId as any;

    await submission.save();

    // Update all documents to approved
    await this.kycDocumentModel.updateMany(
      { kycSubmission: submissionId },
      { status: DocumentStatus.APPROVED },
    );

    // TODO: Update user's isKycVerified field
    // TODO: Send notification to user

    return submission;
  }

  async reject(
    submissionId: string,
    adminId: string,
    rejectionReason: string,
  ) {
    const submission = await this.kycSubmissionModel.findById(submissionId);

    if (!submission) {
      throw new NotFoundException('KYC submission not found');
    }

    if (submission.status !== KycStatus.PENDING) {
      throw new BadRequestException('KYC submission is not pending');
    }

    submission.status = KycStatus.REJECTED;
    submission.rejectedAt = new Date();
    submission.rejectionReason = rejectionReason;
    submission.reviewedBy = adminId as any;

    await submission.save();

    // Update all documents to rejected
    await this.kycDocumentModel.updateMany(
      { kycSubmission: submissionId },
      { status: DocumentStatus.REJECTED },
    );

    // TODO: Send notification to user

    return submission;
  }
}
