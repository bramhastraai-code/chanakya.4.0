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

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(LeadActivity.name)
    private leadActivityModel: Model<LeadActivityDocument>,
  ) {}

  async create(
    createLeadDto: CreateLeadDto,
    agentId: string,
  ): Promise<LeadDocument> {
    const lead = new this.leadModel({
      ...createLeadDto,
      property: createLeadDto.propertyId,
      assignedTo: agentId,
      status: LeadStatus.NEW,
    });

    const savedLead = await lead.save();

    // Create initial activity
    await this.createActivity(
      savedLead._id.toString(),
      ActivityType.STATUS_CHANGE,
      `Lead created with status: ${LeadStatus.NEW}`,
    );

    return savedLead;
  }

  async findAll(
    agentId: string,
    page: number = 1,
    limit: number = 20,
    status?: LeadStatus,
    search?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const query: any = { assignedTo: agentId };

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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.leadModel.countDocuments(query),
    ]);

    // Get stats
    const stats = await this.getLeadStats(agentId);

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

  async findOne(id: string, agentId: string): Promise<any> {
    const lead = await this.leadModel
      .findById(id)
      .populate('property', 'propertyTitle price thumbnail images')
      .populate('assignedTo', 'name email')
      .exec();

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Check if the lead belongs to the agent
    if (lead.assignedTo?._id.toString() !== agentId) {
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
    agentId: string,
  ): Promise<LeadDocument> {
    const lead = await this.leadModel.findById(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.assignedTo?.toString() !== agentId) {
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
        `Status changed from ${oldStatus} to ${updateLeadDto.status}`,
      );
    }

    // Create activity for notes
    if (updateLeadDto.notes) {
      await this.createActivity(
        id,
        ActivityType.NOTE_ADDED,
        `Note added: ${updateLeadDto.notes}`,
      );
    }

    return updatedLead;
  }

  async remove(id: string, agentId: string): Promise<void> {
    const lead = await this.leadModel.findById(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.assignedTo?.toString() !== agentId) {
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

  private async getLeadStats(agentId: string) {
    const [totalLeads, newLeads, qualifiedLeads, closedLeads] =
      await Promise.all([
        this.leadModel.countDocuments({ assignedTo: agentId }),
        this.leadModel.countDocuments({
          assignedTo: agentId,
          status: LeadStatus.NEW,
        }),
        this.leadModel.countDocuments({
          assignedTo: agentId,
          status: LeadStatus.QUALIFIED,
        }),
        this.leadModel.countDocuments({
          assignedTo: agentId,
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
