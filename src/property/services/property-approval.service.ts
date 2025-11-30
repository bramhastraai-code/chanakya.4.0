import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Property } from '../entities/property.entity';

@Injectable()
export class PropertyApprovalService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}

  /**
   * Get all pending properties
   */
  async getPending(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      this.propertyModel
        .find({ approvalStatus: 'pending' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('ownerId', 'email')
        .exec(),
      this.propertyModel.countDocuments({ approvalStatus: 'pending' }),
    ]);

    return {
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Approve property
   */
  async approve(propertyId: string, adminId: Types.ObjectId) {
    const property = await this.propertyModel.findById(propertyId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    property.approvalStatus = 'approved';
    property.approvedBy = adminId;
    property.approvedAt = new Date();
    property.rejectionReason = undefined;

    await property.save();

    return property;
  }

  /**
   * Reject property
   */
  async reject(propertyId: string, adminId: Types.ObjectId, reason: string) {
    const property = await this.propertyModel.findById(propertyId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    property.approvalStatus = 'rejected';
    property.approvedBy = adminId;
    property.approvedAt = new Date();
    property.rejectionReason = reason;

    await property.save();

    return property;
  }

  /**
   * Get approval statistics
   */
  async getStats() {
    const [pending, approved, rejected, total] = await Promise.all([
      this.propertyModel.countDocuments({ approvalStatus: 'pending' }),
      this.propertyModel.countDocuments({ approvalStatus: 'approved' }),
      this.propertyModel.countDocuments({ approvalStatus: 'rejected' }),
      this.propertyModel.countDocuments(),
    ]);

    return {
      pending,
      approved,
      rejected,
      total,
    };
  }
}
