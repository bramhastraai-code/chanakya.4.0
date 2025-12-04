import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lead } from './entities/lead.entity';
import { LeadActivity, ActivityType } from './entities/lead-activity.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import {
  UpdateLeadDto,
  AssignLeadDto,
  AddActivityDto,
} from './dto/v1/lead.dto';
import { LeadStatus } from './enum/lead-status.enum';
import { UserRole } from 'src/common/enum/user-role.enum';
import { VisibilityService } from '../common/services/visibility.service';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<Lead>,
    @InjectModel(LeadActivity.name) private activityModel: Model<LeadActivity>,
    private visibilityService: VisibilityService,
  ) {}

  /**
   * Create new lead (User creates inquiry)
   */
  async create(
    customerId: Types.ObjectId,
    dto: CreateLeadDto,
    source: string = 'website',
  ) {
    const lead = await this.leadModel.create({
      ...dto,
      property: dto.propertyId,
      createdBy: customerId,
      source,
      status: LeadStatus.NEW,
    });

    // Log initial activity
    await this.logActivity(
      lead._id,
      customerId,
      ActivityType.NOTE_ADDED,
      'Lead inquiry submitted',
    );

    return lead.populate('property', 'propertyTitle price city');
  }

  /**
   * Get all leads (with filters)
   */
  async findAll(filters: any = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      assignedTo,
      createdBy,
      isQualified,
      source,
      dateFrom,
      dateTo,
    } = filters;

    const query: any = {};

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (createdBy) query.createdBy = createdBy;
    if (isQualified !== undefined) query.isQualified = isQualified;
    if (source) query.source = source;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [leads, total] = await Promise.all([
      this.leadModel
        .find(query)
        .populate('property', 'propertyTitle price city thumbnail')
        .populate('assignedTo', 'email')
        .populate('createdBy', 'email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.leadModel.countDocuments(query),
    ]);

    return {
      leads,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get leads by agent
   */
  async findByAgent(agentId: Types.ObjectId, filters: any = {}) {
    return this.findAll({ ...filters, assignedTo: agentId });
  }

  /**
   * Get leads by customer
   */
  async findByUser(customerId: Types.ObjectId, filters: any = {}) {
    return this.findAll({ ...filters, createdBy: customerId });
  }

  /**
   * Get single lead with activity timeline
   */
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid lead ID');
    }

    const lead = await this.leadModel
      .findById(id)
      .populate('property', 'propertyTitle price city thumbnail images')
      .populate('assignedTo', 'email')
      .populate('createdBy', 'email')
      .exec();

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Get activity timeline
    const activities = await this.activityModel
      .find({ lead: id })
      .populate('performedBy', 'email')
      .sort({ createdAt: -1 })
      .exec();

    return {
      ...lead.toObject(),
      activities,
    };
  }

  /**
   * Update lead (agent updates status, notes, etc.)
   */
  async update(id: string, userId: Types.ObjectId, dto: UpdateLeadDto) {
    const lead = await this.leadModel.findById(id);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Check if user is assigned agent or admin
    if (lead.assignedTo && lead.assignedTo.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only update leads assigned to you');
    }

    const oldStatus = lead.status;

    // Update lead
    Object.assign(lead, dto);
    lead.lastContactedAt = new Date();
    await lead.save();

    // Log status change
    if (dto.status && dto.status !== oldStatus) {
      await this.logActivity(
        lead._id,
        userId,
        ActivityType.STATUS_CHANGE,
        `Status changed from ${oldStatus} to ${dto.status}`,
      );
    }

    // Log notes
    if (dto.notes) {
      await this.logActivity(
        lead._id,
        userId,
        ActivityType.NOTE_ADDED,
        dto.notes,
      );
    }

    return lead;
  }

  /**
   * Assign lead to agent (Admin function)
   */
  async assignToAgent(
    leadId: string,
    agentId: string,
    adminId: Types.ObjectId,
  ) {
    const lead = await this.leadModel.findById(leadId);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    lead.assignedTo = new Types.ObjectId(agentId);
    lead.assignedAt = new Date();
    await lead.save();

    // Log assignment
    await this.logActivity(
      lead._id,
      adminId,
      ActivityType.NOTE_ADDED,
      `Lead assigned to agent`,
      { agentId },
    );

    return lead.populate('assignedTo', 'email');
  }

  /**
   * Mark lead as qualified/unqualified
   */
  async updateQualification(
    leadId: string,
    userId: Types.ObjectId,
    isQualified: boolean,
  ) {
    const lead = await this.leadModel.findById(leadId);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.assignedTo?.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'You can only qualify leads assigned to you',
      );
    }

    lead.isQualified = isQualified;
    await lead.save();

    await this.logActivity(
      lead._id,
      userId,
      ActivityType.NOTE_ADDED,
      `Lead marked as ${isQualified ? 'qualified' : 'unqualified'}`,
    );

    return lead;
  }

  /**
   * Add activity to lead
   */
  async addActivity(
    leadId: string,
    userId: Types.ObjectId,
    dto: AddActivityDto,
  ) {
    const lead = await this.leadModel.findById(leadId);

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.assignedTo?.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'You can only add activities to leads assigned to you',
      );
    }

    await this.logActivity(
      lead._id,
      userId,
      dto.type as ActivityType,
      dto.description,
      dto.metadata,
    );

    // Update last contacted
    lead.lastContactedAt = new Date();
    await lead.save();

    return { message: 'Activity added successfully' };
  }

  /**
   * Get agent statistics
   */
  async getAgentStats(agentId: Types.ObjectId) {
    const [total, newLeads, qualified, converted, lost] = await Promise.all([
      this.leadModel.countDocuments({ assignedTo: agentId }),
      this.leadModel.countDocuments({
        assignedTo: agentId,
        status: LeadStatus.NEW,
      }),
      this.leadModel.countDocuments({ assignedTo: agentId, isQualified: true }),
      this.leadModel.countDocuments({
        assignedTo: agentId,
        status: LeadStatus.CLOSED,
      }),
      this.leadModel.countDocuments({
        assignedTo: agentId,
        status: LeadStatus.LOST,
      }),
    ]);

    const conversionRate =
      total > 0 ? ((converted / total) * 100).toFixed(2) : 0;

    return {
      total,
      newLeads,
      qualified,
      converted,
      lost,
      conversionRate: parseFloat(conversionRate as string),
    };
  }

  /**
   * Get admin statistics
   */
  async getAdminStats() {
    const [total, unassigned, assigned, qualified, converted] =
      await Promise.all([
        this.leadModel.countDocuments(),
        this.leadModel.countDocuments({ assignedTo: null }),
        this.leadModel.countDocuments({ assignedTo: { $ne: null } }),
        this.leadModel.countDocuments({ isQualified: true }),
        this.leadModel.countDocuments({ status: LeadStatus.CLOSED }),
      ]);

    // Leads by source
    const bySource = await this.leadModel.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    return {
      total,
      unassigned,
      assigned,
      qualified,
      converted,
      bySource,
    };
  }

  /**
   * Private: Log activity
   */
  private async logActivity(
    leadId: Types.ObjectId,
    userId: Types.ObjectId,
    type: ActivityType,
    description: string,
    metadata?: Record<string, any>,
  ) {
    await this.activityModel.create({
      lead: leadId,
      type,
      description,
      performedBy: userId,
      metadata,
    });
  }

  /**
   * Get leads visible to an agent (assigned + builder's projects)
   */
  async findAllForAgent(
    agentId: string,
    filters: {
      page?: number;
      limit?: number;
      status?: LeadStatus;
      isQualified?: boolean;
      source?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {},
  ) {
    const { page = 1, limit = 20, ...queryFilters } = filters;
    const leads = await this.visibilityService.getVisibleLeadsForAgent(
      agentId,
      queryFilters,
    );

    const skip = (page - 1) * limit;
    const total = leads.length;
    const paginatedLeads = leads.slice(skip, skip + limit);

    return {
      leads: paginatedLeads,
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

  /**
   * Get leads visible to a builder (their projects)
   */
  async findAllForBuilder(
    builderId: string,
    filters: {
      page?: number;
      limit?: number;
      status?: LeadStatus;
      isQualified?: boolean;
      source?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {},
  ) {
    const { page = 1, limit = 20, ...queryFilters } = filters;
    const leads = await this.visibilityService.getVisibleLeadsForBuilder(
      builderId,
      queryFilters,
    );

    const skip = (page - 1) * limit;
    const total = leads.length;
    const paginatedLeads = leads.slice(skip, skip + limit);

    return {
      leads: paginatedLeads,
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

  /**
   * Check if an agent can view a specific lead
   */
  async canAgentViewLead(agentId: string, leadId: string): Promise<boolean> {
    return this.visibilityService.canAgentViewLead(agentId, leadId);
  }
}
