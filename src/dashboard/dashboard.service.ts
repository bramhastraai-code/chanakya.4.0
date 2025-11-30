import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AgentStats } from './entities/agent-stats.entity';
import { ChatHistory } from './entities/chat-history.entity';
import { ChatMessageDto } from './dto/chat-message.dto';
import { Property } from 'src/property/entities/property.entity';
import { Lead } from 'src/lead/entities/lead.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(AgentStats.name) private agentStatsModel: Model<AgentStats>,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    @InjectModel(Property.name) private propertyModel: Model<Property>,
    @InjectModel(Lead.name) private leadModel: Model<Lead>,
  ) {}

  /**
   * Get agent dashboard stats
   */
  async getAgentStats(agentId: string) {
    let stats = await this.agentStatsModel.findOne({ agent: agentId });

    // If stats don't exist, create them
    if (!stats) {
      stats = await this.createAgentStats(agentId);
    }

    // Update stats from actual data
    await this.updateStatsFromData(agentId);

    // Fetch updated stats
    stats = await this.agentStatsModel.findOne({ agent: agentId });

    return stats;
  }

  /**
   * Get listings summary
   */
  async getListingsSummary(agentId: string) {
    const [total, rental, resell, projects] = await Promise.all([
      this.propertyModel.countDocuments({ customer: agentId }),
      this.propertyModel.countDocuments({
        customer: agentId,
        propertyPurpose: 'rent',
      }),
      this.propertyModel.countDocuments({
        customer: agentId,
        propertyPurpose: 'sell',
      }),
      this.propertyModel.countDocuments({
        customer: agentId,
        propertyType: 'project',
      }),
    ]);

    return {
      total,
      rental,
      resell,
      projects,
    };
  }

  /**
   * AI Chatbot interaction
   */
  async chat(agentId: string, chatDto: ChatMessageDto) {
    // Find or create chat history
    let chatHistory = await this.chatHistoryModel.findOne({ agent: agentId });

    if (!chatHistory) {
      chatHistory = new this.chatHistoryModel({
        agent: agentId,
        messages: [],
      });
    }

    // Add user message
    chatHistory.messages.push({
      role: 'user',
      content: chatDto.message,
      timestamp: new Date(),
    });

    // Generate AI response (placeholder - integrate with actual AI service)
    const aiResponse = await this.generateAIResponse(chatDto.message);

    // Add assistant message
    chatHistory.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    });

    // Keep only last 50 messages
    if (chatHistory.messages.length > 50) {
      chatHistory.messages = chatHistory.messages.slice(-50);
    }

    await chatHistory.save();

    return {
      userMessage: chatDto.message,
      aiResponse,
      timestamp: new Date(),
    };
  }

  /**
   * Get chat history
   */
  async getChatHistory(agentId: string, limit: number = 20) {
    const chatHistory = await this.chatHistoryModel.findOne({ agent: agentId });

    if (!chatHistory) {
      return {
        messages: [],
        suggestedQuestions: this.getSuggestedQuestions(),
      };
    }

    const messages = chatHistory.messages.slice(-limit);

    return {
      messages,
      suggestedQuestions: this.getSuggestedQuestions(),
    };
  }

  /**
   * Get suggested questions for chatbot
   */
  private getSuggestedQuestions(): string[] {
    return [
      'RERA kya hota hai?',
      'What is TNC Diversion?',
      'RERA kya hota hai?',
      'What is TNC Diversion?',
    ];
  }

  /**
   * Generate AI response (placeholder)
   */
  private async generateAIResponse(message: string): Promise<string> {
    // TODO: Integrate with actual AI service (OpenAI, Gemini, etc.)
    
    // Simple keyword-based responses for now
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('rera')) {
      return 'RERA (Real Estate Regulatory Authority) is a regulatory body that oversees the real estate sector in India. It was established under the Real Estate (Regulation and Development) Act, 2016 to protect homebuyers and boost investments in the real estate industry. RERA ensures transparency, accountability, and efficiency in the real estate sector.';
    }

    if (lowerMessage.includes('tnc') || lowerMessage.includes('diversion')) {
      return 'TNC Diversion refers to the conversion of land use from one category to another, typically from agricultural to non-agricultural purposes. This requires approval from the relevant authorities and involves a legal process to change the land classification.';
    }

    return 'I understand your question. As an AI assistant for real estate professionals, I can help you with property-related queries, market insights, legal information, and best practices. Could you please provide more details about what you\'d like to know?';
  }

  /**
   * Create agent stats
   */
  private async createAgentStats(agentId: string) {
    const stats = new this.agentStatsModel({
      agent: agentId,
      views: 0,
      retwines: 0,
      leads: 0,
      calls: 0,
      totalListings: 0,
      rentalListings: 0,
      resellListings: 0,
      projectListings: 0,
    });

    return await stats.save();
  }

  /**
   * Update stats from actual data
   */
  private async updateStatsFromData(agentId: string) {
    const [listingsSummary, leadsCount, totalViews] = await Promise.all([
      this.getListingsSummary(agentId),
      this.leadModel.countDocuments({ agent: agentId }),
      this.propertyModel.aggregate([
        { $match: { customer: agentId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
      ]),
    ]);

    await this.agentStatsModel.findOneAndUpdate(
      { agent: agentId },
      {
        totalListings: listingsSummary.total,
        rentalListings: listingsSummary.rental,
        resellListings: listingsSummary.resell,
        projectListings: listingsSummary.projects,
        leads: leadsCount,
        views: totalViews[0]?.totalViews || 0,
      },
      { upsert: true },
    );
  }

  /**
   * Increment specific stat
   */
  async incrementStat(
    agentId: string,
    statName: 'views' | 'retwines' | 'leads' | 'calls',
    amount: number = 1,
  ) {
    await this.agentStatsModel.findOneAndUpdate(
      { agent: agentId },
      { $inc: { [statName]: amount } },
      { upsert: true },
    );
  }
}
