import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lead, LeadDocument } from './entities/lead.entity';
import {
  LeadActivity,
  LeadActivityDocument,
  ActivityType,
} from './entities/lead-activity.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from './enum/lead-status.enum';
import { UserRole } from 'src/common/enum/user-role.enum';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(LeadActivity.name)
    private leadActivityModel: Model<LeadActivityDocument>,
  ) {}

  async create(createLeadDto: CreateLeadDto, user: any): Promise<LeadDocument> {
    const leadData: any = {
      ...createLeadDto,
      property: createLeadDto.propertyId,
      status: LeadStatus.NEW,
      createdBy: user.userId,
    };

    if (user.role === UserRole.AGENT) {
      leadData.assignedTo = user.userId;
    } else if (user.role === UserRole.ADMIN) {
      if (createLeadDto.assignedTo) {
        leadData.assignedTo = createLeadDto.assignedTo;
      }
    } else if (user.role === UserRole.BUILDER) {
      // Builder creates lead, assignedTo can be null initially or self if they act as agent
      // For now, leaving assignedTo empty unless logic dictates otherwise
    }

    const lead = new this.leadModel(leadData);
    const savedLead = await lead.save();

    // Create initial activity
    await this.createActivity(
      savedLead._id.toString(),
      ActivityType.STATUS_CHANGE,
      `Lead created by ${user.role} with status: ${LeadStatus.NEW}`,
    );

    return savedLead;
  }

  async findAll(
    user: any,
    page: number = 1,
    limit: number = 20,
    status?: LeadStatus,
    search?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const query: any = {};

    // Role-based filtering
    if (user.role === UserRole.AGENT) {
      query.assignedTo = user.userId;
    } else if (user.role === UserRole.BUILDER) {
      query.createdBy = user.userId;
    }
    // Admin sees all

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      this.leadModel
        .find(query)
        .populate('property', 'propertyTitle price thumbnail')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.leadModel.countDocuments(query),
    ]);

    // Get stats (filtered by role)
    const stats = await this.getLeadStats(user);

    return {
      leads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      stats,
    };
  }

  async findOne(id: string, user: any): Promise<any> {
    const lead = await this.leadModel
      .findById(id)
      .populate('property', 'propertyTitle price thumbnail images')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email role')
      .exec();

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Role-based access check
    if (
      user.role === UserRole.AGENT &&
      lead.assignedTo?._id.toString() !== user.userId
    ) {
      throw new ForbiddenException('You do not have access to this lead');
    }
    if (
      user.role === UserRole.BUILDER &&
      lead.createdBy?._id.toString() !== user.userId
    ) {
      throw new ForbiddenException('You do not have access to this lead');
    }

    // Get activity timeline
    const activityTimeline = await this.leadActivityModel
      .find({ lead: id })
      .sort({ createdAt: -1 })
      .exec();

    return {
      ...lead.toObject(),
      activityTimeline,
    };
  }

  async update(
    id: string,
    updateLeadDto: UpdateLeadDto,
    user: any,
  ): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Role-based access check
    if (
      user.role === UserRole.AGENT &&
      lead.assignedTo?.toString() !== user.userId
    ) {
      throw new ForbiddenException('You do not have access to this lead');
    }
    if (
      user.role === UserRole.BUILDER &&
      lead.createdBy?.toString() !== user.userId
    ) {
      throw new ForbiddenException('You do not have access to this lead');
    }

    const oldStatus = lead.status;

    // Update lead
    Object.assign(lead, updateLeadDto);
    const updatedLead = await lead.save();

    // Create activity for status change
    if (updateLeadDto.status && updateLeadDto.status !== oldStatus) {
      await this.createActivity(
        id,
        ActivityType.STATUS_CHANGE,
        `Status changed from ${oldStatus} to ${updateLeadDto.status} by ${user.name}`,
      );
    }

    // Create activity for notes
    if (updateLeadDto.notes) {
      await this.createActivity(
        id,
        ActivityType.NOTE_ADDED,
        `Note added by ${user.name}: ${updateLeadDto.notes}`,
      );
    }

    return updatedLead;
  }

  async remove(id: string, user: any): Promise<void> {
    const lead = await this.leadModel.findById(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Role-based access check
    if (
      user.role === UserRole.AGENT &&
      lead.assignedTo?.toString() !== user.userId
    ) {
      throw new ForbiddenException('You do not have access to this lead');
    }
    if (
      user.role === UserRole.BUILDER &&
      lead.createdBy?.toString() !== user.userId
    ) {
      throw new ForbiddenException('You do not have access to this lead');
    }

    await this.leadModel.findByIdAndDelete(id);
    await this.leadActivityModel.deleteMany({ lead: id });
  }

  private async createActivity(
    leadId: string,
    type: ActivityType,
    description: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const activity = new this.leadActivityModel({
      lead: leadId,
      type,
      description,
      metadata,
    });
    await activity.save();
  }

  private async getLeadStats(user: any) {
    const query: any = {};
    if (user.role === UserRole.AGENT) {
      query.assignedTo = user.userId;
    } else if (user.role === UserRole.BUILDER) {
      query.createdBy = user.userId;
    }

    const [totalLeads, newLeads, qualifiedLeads, closedLeads] =
      await Promise.all([
        this.leadModel.countDocuments(query),
        this.leadModel.countDocuments({
          ...query,
          status: LeadStatus.NEW,
        }),
        this.leadModel.countDocuments({
          ...query,
          status: LeadStatus.QUALIFIED,
        }),
        this.leadModel.countDocuments({
          ...query,
          status: LeadStatus.CLOSED,
        }),
      ]);

    const conversionRate =
      totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(2) : 0;

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      conversionRate: parseFloat(conversionRate as string),
    };
  }
}
