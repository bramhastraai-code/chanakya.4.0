import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AgentBuilderAssociation } from '../entities/agent-builder-association.entity';
import { AgentProfile } from '../entities/agent-profile.entity';

@Injectable()
export class AgentBuilderAssociationService {
  constructor(
    @InjectModel(AgentBuilderAssociation.name)
    private associationModel: Model<AgentBuilderAssociation>,
    @InjectModel(AgentProfile.name)
    private agentProfileModel: Model<AgentProfile>,
  ) {}

  /**
   * Create association between agent and builder for a project
   */
  async createAssociation(
    agentId: string,
    builderId: string,
    projectId: string,
    invitedBy?: string,
  ) {
    // Check if association already exists
    const existing = await this.associationModel.findOne({
      agentId: new Types.ObjectId(agentId),
      builderId: new Types.ObjectId(builderId),
      projectId: new Types.ObjectId(projectId),
    });

    if (existing) {
      if (existing.isActive) {
        throw new BadRequestException(
          'Association already exists and is active',
        );
      }
      // Reactivate if exists but inactive
      existing.isActive = true;
      existing.status = 'approved';
      existing.approvedAt = new Date();
      await existing.save();
      return existing;
    }

    // Create new association
    const association = await this.associationModel.create({
      agentId: new Types.ObjectId(agentId),
      builderId: new Types.ObjectId(builderId),
      projectId: new Types.ObjectId(projectId),
      invitedBy: invitedBy ? new Types.ObjectId(invitedBy) : undefined,
      invitedAt: new Date(),
      status: 'approved', // Auto-approve for now, can add approval workflow later
      approvedAt: new Date(),
      isActive: true,
    });

    // Update agent profile with association
    await this.agentProfileModel.findOneAndUpdate(
      { userId: new Types.ObjectId(agentId) },
      {
        $addToSet: {
          builderAssociations: {
            builderId: new Types.ObjectId(builderId),
            projectId: new Types.ObjectId(projectId),
            isActive: true,
            joinedAt: new Date(),
          },
        },
      },
    );

    return association;
  }

  /**
   * Get all builders and projects an agent is associated with
   */
  async getAgentAssociations(agentId: string) {
    return await this.associationModel
      .find({
        agentId: new Types.ObjectId(agentId),
        isActive: true,
      })
      .populate('builderId', 'name email companyName')
      .populate('projectId', 'projectName thumbnail location')
      .sort({ createdAt: -1 });
  }

  /**
   * Get all agents associated with a builder
   */
  async getBuilderAgents(builderId: string, projectId?: string) {
    const query: any = {
      builderId: new Types.ObjectId(builderId),
      isActive: true,
    };

    if (projectId) {
      query.projectId = new Types.ObjectId(projectId);
    }

    return await this.associationModel
      .find(query)
      .populate('agentId', 'name email phone profileImage')
      .sort({ createdAt: -1 });
  }

  /**
   * Get all agents associated with a specific project
   */
  async getProjectAgents(projectId: string) {
    return await this.associationModel
      .find({
        projectId: new Types.ObjectId(projectId),
        isActive: true,
      })
      .populate('agentId', 'name email phone profileImage company')
      .populate('builderId', 'name companyName')
      .sort({ createdAt: -1 });
  }

  /**
   * Remove association by ID (deactivate)
   */
  async removeAssociationById(associationId: string) {
    const association = await this.associationModel.findByIdAndUpdate(
      associationId,
      { isActive: false, deactivatedAt: new Date() },
      { new: true },
    );

    if (!association) {
      throw new NotFoundException('Association not found');
    }

    // Update agent profile
    await this.agentProfileModel.findOneAndUpdate(
      { userId: association.agentId },
      {
        $pull: {
          builderAssociations: {
            builderId: association.builderId,
            projectId: association.projectId,
          },
        },
      },
    );

    return association;
  }

  /**
   * Remove association (deactivate) by agent, builder, project
   */
  async removeAssociation(
    agentId: string,
    builderId: string,
    projectId: string,
  ) {
    const association = await this.associationModel.findOneAndUpdate(
      {
        agentId: new Types.ObjectId(agentId),
        builderId: new Types.ObjectId(builderId),
        projectId: new Types.ObjectId(projectId),
      },
      {
        isActive: false,
      },
      { new: true },
    );

    if (!association) {
      throw new NotFoundException('Association not found');
    }

    // Update agent profile
    await this.agentProfileModel.findOneAndUpdate(
      { userId: new Types.ObjectId(agentId) },
      {
        $pull: {
          builderAssociations: {
            builderId: new Types.ObjectId(builderId),
            projectId: new Types.ObjectId(projectId),
          },
        },
      },
    );

    return association;
  }

  /**
   * Check if agent is associated with builder for a project
   */
  async isAgentAssociated(
    agentId: string,
    builderId: string,
    projectId: string,
  ): Promise<boolean> {
    const association = await this.associationModel.findOne({
      agentId: new Types.ObjectId(agentId),
      builderId: new Types.ObjectId(builderId),
      projectId: new Types.ObjectId(projectId),
      isActive: true,
    });

    return !!association;
  }

  /**
   * Get all projects an agent is associated with under a builder
   */
  async getAgentProjectsUnderBuilder(agentId: string, builderId: string) {
    return await this.associationModel
      .find({
        agentId: new Types.ObjectId(agentId),
        builderId: new Types.ObjectId(builderId),
        isActive: true,
      })
      .populate('projectId')
      .select('projectId');
  }

  /**
   * Bulk create associations for multiple agents
   */
  async bulkCreateAssociations(
    agentIds: string[],
    builderId: string,
    projectId: string,
    invitedBy?: string,
  ) {
    const results = await Promise.allSettled(
      agentIds.map((agentId) =>
        this.createAssociation(agentId, builderId, projectId, invitedBy),
      ),
    );

    return {
      successful: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
      results,
    };
  }
}
