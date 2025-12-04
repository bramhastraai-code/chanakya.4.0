import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Requirement } from '../../requirement/entities/requirement.entity';
import { Lead } from '../../lead/entities/lead.entity';
import { AgentBuilderAssociation } from '../../agent/entities/agent-builder-association.entity';

@Injectable()
export class VisibilityService {
  constructor(
    @InjectModel(AgentBuilderAssociation.name)
    private associationModel: Model<AgentBuilderAssociation>,
    @InjectModel(Requirement.name)
    private requirementModel: Model<Requirement>,
    @InjectModel(Lead.name)
    private leadModel: Model<Lead>,
  ) {}

  /**
   * Get requirements visible to an agent (public + builder's project requirements + same-builder agent posts)
   */
  async getVisibleRequirementsForAgent(agentId: string, filters: any = {}) {
    // Get agent's builder associations
    const associations = await this.associationModel
      .find({
        agentId: new Types.ObjectId(agentId),
        isActive: true,
      })
      .select('builderId projectId');

    const builderIds = associations.map((a) => a.builderId);
    const projectIds = associations.map((a) => a.projectId);

    // Get other agents who share the same builders
    const sharedBuilderAgents = await this.associationModel
      .find({
        builderId: { $in: builderIds },
        isActive: true,
        agentId: { $ne: new Types.ObjectId(agentId) }, // Exclude current agent
      })
      .distinct('agentId');

    // Query: public requirements OR requirements from associated builders/projects OR requirements posted by agents with shared builders
    const query: any = {
      $or: [
        { isPublic: true },
        { builderId: { $in: builderIds } },
        { projectId: { $in: projectIds } },
        { postedBy: { $in: sharedBuilderAgents } }, // Requirements posted by agents with same builder
      ],
      ...filters,
    };

    return await this.requirementModel
      .find(query)
      .populate('userId', 'name email phone')
      .populate('projectId', 'projectName thumbnail')
      .populate('builderId', 'companyName')
      .populate('postedBy', 'name email phone')
      .populate('acceptedBy', 'name email phone')
      .sort({ createdAt: -1 });
  }

  /**
   * Get requirements visible to a builder (their projects + public)
   */
  async getVisibleRequirementsForBuilder(builderId: string, filters: any = {}) {
    const query: any = {
      $or: [{ isPublic: true }, { builderId: new Types.ObjectId(builderId) }],
      ...filters,
    };

    return await this.requirementModel
      .find(query)
      .populate('userId', 'name email phone')
      .populate('projectId', 'projectName thumbnail')
      .sort({ createdAt: -1 });
  }

  /**
   * Get leads visible to an agent (assigned to them + builder's project leads)
   */
  async getVisibleLeadsForAgent(agentId: string, filters: any = {}) {
    // Get agent's builder associations
    const associations = await this.associationModel
      .find({
        agentId: new Types.ObjectId(agentId),
        isActive: true,
      })
      .select('builderId projectId');

    const builderIds = associations.map((a) => a.builderId);
    const projectIds = associations.map((a) => a.projectId);

    // Query: assigned to agent OR from associated builders/projects
    const query: any = {
      $or: [
        { assignedTo: new Types.ObjectId(agentId) },
        { builderId: { $in: builderIds } },
        { projectId: { $in: projectIds } },
      ],
      ...filters,
    };

    return await this.leadModel
      .find(query)
      .populate('property', 'propertyTitle price thumbnail location')
      .populate('assignedTo', 'name email phone')
      .populate('projectId', 'projectName')
      .populate('builderId', 'companyName')
      .sort({ createdAt: -1 });
  }

  /**
   * Get leads visible to a builder (their projects)
   */
  async getVisibleLeadsForBuilder(builderId: string, filters: any = {}) {
    const query: any = {
      builderId: new Types.ObjectId(builderId),
      ...filters,
    };

    return await this.leadModel
      .find(query)
      .populate('property', 'propertyTitle price thumbnail location')
      .populate('assignedTo', 'name email phone')
      .populate('projectId', 'projectName')
      .sort({ createdAt: -1 });
  }

  /**
   * Check if an agent can view a specific requirement
   */
  async canAgentViewRequirement(
    agentId: string,
    requirementId: string,
  ): Promise<boolean> {
    const requirement = await this.requirementModel.findById(requirementId);
    if (!requirement) return false;

    // Public requirements are visible to all
    if (requirement.isPublic) return true;

    // Check if agent is associated with the builder/project
    if (requirement.builderId || requirement.projectId) {
      const query: any = {
        agentId: new Types.ObjectId(agentId),
        isActive: true,
      };

      if (requirement.builderId) {
        query.builderId = requirement.builderId;
      }
      if (requirement.projectId) {
        query.projectId = requirement.projectId;
      }

      const association = await this.associationModel.findOne(query);
      return !!association;
    }

    return false;
  }

  /**
   * Check if an agent can view a specific lead
   */
  async canAgentViewLead(agentId: string, leadId: string): Promise<boolean> {
    const lead = await this.leadModel.findById(leadId);
    if (!lead) return false;

    // Lead assigned to agent
    if (lead.assignedTo?.toString() === agentId) return true;

    // Check if agent is associated with the builder/project
    if (lead.builderId || lead.projectId) {
      const query: any = {
        agentId: new Types.ObjectId(agentId),
        isActive: true,
      };

      if (lead.builderId) {
        query.builderId = lead.builderId;
      }
      if (lead.projectId) {
        query.projectId = lead.projectId;
      }

      const association = await this.associationModel.findOne(query);
      return !!association;
    }

    return false;
  }

  /**
   * Get all agents who should have access to a requirement
   */
  async getAgentsWithAccessToRequirement(requirementId: string) {
    const requirement = await this.requirementModel.findById(requirementId);
    if (!requirement) return [];

    // If public, return all active agents (or implement pagination)
    if (requirement.isPublic) {
      // Return empty array for now, implement if needed
      return [];
    }

    // Get associated agents
    const query: any = { isActive: true };
    if (requirement.builderId) {
      query.builderId = requirement.builderId;
    }
    if (requirement.projectId) {
      query.projectId = requirement.projectId;
    }

    const associations = await this.associationModel
      .find(query)
      .populate('agentId', 'name email phone')
      .select('agentId');

    return associations.map((a) => a.agentId);
  }

  /**
   * Get all agents who should have access to a lead
   */
  async getAgentsWithAccessToLead(leadId: string) {
    const lead = await this.leadModel.findById(leadId);
    if (!lead) return [];

    const query: any = { isActive: true };
    if (lead.builderId) {
      query.builderId = lead.builderId;
    }
    if (lead.projectId) {
      query.projectId = lead.projectId;
    }

    const associations = await this.associationModel
      .find(query)
      .populate('agentId', 'name email phone')
      .select('agentId');

    return associations.map((a) => a.agentId);
  }
}
