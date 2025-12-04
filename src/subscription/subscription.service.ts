import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { AgentSubscription } from './entities/agent-subscription.entity';
import { PurchaseSubscriptionDto } from './dto/purchase-subscription.dto';
import {
  SubscriptionStatus,
  SubscriptionPlanType,
} from './enum/subscription.enum';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
    @InjectModel(AgentSubscription.name)
    private agentSubscriptionModel: Model<AgentSubscription>,
  ) {}

  /**
   * Get all active subscription plans
   */
  async getAllPlans() {
    const plans = await this.subscriptionPlanModel
      .find({ isActive: true })
      .sort({ priority: 1 })
      .exec();

    return plans;
  }

  /**
   * Get current active subscription for agent
   */
  async getCurrentSubscription(agentId: string) {
    const subscription = await this.agentSubscriptionModel
      .findOne({
        agent: agentId,
        status: SubscriptionStatus.ACTIVE,
        endDate: { $gte: new Date() },
      })
      .populate('plan')
      .sort({ createdAt: -1 })
      .exec();

    if (!subscription) {
      return null;
    }

    // Calculate days remaining
    const now = new Date();
    const daysRemaining = Math.ceil(
      (subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      ...subscription.toObject(),
      daysRemaining,
    };
  }

  /**
   * Purchase subscription
   */
  async purchaseSubscription(
    agentId: string,
    purchaseDto: PurchaseSubscriptionDto,
  ) {
    // Find the plan
    const plan = await this.subscriptionPlanModel.findOne({
      name: purchaseDto.planType,
      isActive: true,
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    // Check if user already has an active subscription
    const existingSubscription = await this.agentSubscriptionModel.findOne({
      agent: agentId,
      status: SubscriptionStatus.ACTIVE,
      endDate: { $gte: new Date() },
    });

    if (existingSubscription) {
      throw new BadRequestException(
        'You already have an active subscription. Please wait for it to expire or cancel it first.',
      );
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create payment order (integrate with Razorpay or other payment gateway)
    const orderId = `ORDER_${Date.now()}_${agentId}`;
    const paymentId = `PAY_${Date.now()}`;

    // Create subscription
    const subscription = new this.agentSubscriptionModel({
      agent: agentId,
      plan: plan._id,
      startDate,
      endDate,
      status: SubscriptionStatus.ACTIVE,
      paymentId,
      orderId,
      amount: plan.price,
      commissionSaved: 0,
      autoRenew: purchaseDto.autoRenew || false,
    });

    await subscription.save();

    // TODO: Integrate with payment gateway
    // TODO: Send notification to user
    // TODO: Update user's subscription status in User entity

    return {
      subscription: await subscription.populate('plan'),
      orderId,
      paymentId,
    };
  }

  /**
   * Get commission tracking details
   */
  async getCommissionTracking(agentId: string) {
    const currentSubscription = await this.getCurrentSubscription(agentId);

    if (!currentSubscription) {
      return {
        currentPlan: null,
        commissionSaved: 0,
        totalSavings: 0,
        savingsBreakdown: [],
      };
    }

    // Get all subscriptions for total savings
    const allSubscriptions = await this.agentSubscriptionModel
      .find({ agent: agentId })
      .exec();

    const totalSavings = allSubscriptions.reduce(
      (sum, sub) => sum + (sub.commissionSaved || 0),
      0,
    );

    // Get savings breakdown by month
    const savingsBreakdown = await this.agentSubscriptionModel.aggregate([
      { $match: { agent: agentId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSaved: { $sum: '$commissionSaved' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    return {
      currentPlan: currentSubscription.plan,
      commissionSaved: currentSubscription.commissionSaved,
      totalSavings,
      savingsBreakdown,
    };
  }

  /**
   * Get subscription benefits
   */
  async getSubscriptionBenefits(agentId: string) {
    const currentSubscription = await this.getCurrentSubscription(agentId);

    if (!currentSubscription) {
      return {
        hasSubscription: false,
        benefits: [],
      };
    }

    const plan = currentSubscription.plan as any;

    return {
      hasSubscription: true,
      planName: plan.displayName,
      benefits: {
        commissionRate: plan.commissionRate,
        maxListings: plan.maxListings,
        maxLeads: plan.maxLeads,
        aiToolsAccess: plan.aiToolsAccess,
        websiteBuilder: plan.websiteBuilder,
        features: plan.features,
      },
      expiresAt: currentSubscription.endDate,
      daysRemaining: currentSubscription.daysRemaining,
    };
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(agentId: string) {
    const subscription = await this.agentSubscriptionModel.findOne({
      agent: agentId,
      status: SubscriptionStatus.ACTIVE,
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.autoRenew = false;
    await subscription.save();

    // TODO: Send notification to user

    return subscription;
  }

  /**
   * Update commission saved (called when agent completes a transaction)
   */
  async updateCommissionSaved(agentId: string, amount: number) {
    const subscription = await this.agentSubscriptionModel.findOne({
      agent: agentId,
      status: SubscriptionStatus.ACTIVE,
      endDate: { $gte: new Date() },
    });

    if (!subscription) {
      return null;
    }

    subscription.commissionSaved += amount;
    await subscription.save();

    return subscription;
  }

  /**
   * Check and expire subscriptions (cron job)
   */
  async expireSubscriptions() {
    const now = new Date();

    const expiredSubscriptions = await this.agentSubscriptionModel.updateMany(
      {
        status: SubscriptionStatus.ACTIVE,
        endDate: { $lt: now },
      },
      {
        $set: { status: SubscriptionStatus.EXPIRED },
      },
    );

    return expiredSubscriptions;
  }

  /**
   * Seed default subscription plans (for initial setup)
   */
  async seedPlans() {
    const existingPlans = await this.subscriptionPlanModel.countDocuments();
    if (existingPlans > 0) {
      return { message: 'Plans already exist' };
    }

    const plans = [
      {
        name: SubscriptionPlanType.GO,
        displayName: 'Go',
        price: 999,
        duration: 30,
        features: [
          'Unlimited Poster Agent',
          'Visibility upto 2X',
          'AI Closing Support',
          'Leads & site Visit',
          'All Marketplaces & Meta Integration',
          'Unlimited Listing & Chanakya AI',
          'Potential earning opportunity of 50,000',
        ],
        commissionRate: 0,
        maxListings: -1,
        maxLeads: -1,
        aiToolsAccess: true,
        websiteBuilder: false,
        priority: 1,
        isActive: true,
      },
      {
        name: SubscriptionPlanType.PRO,
        displayName: 'Pro',
        price: 4999,
        duration: 30,
        features: [
          'Unlimited Poster Agent & AI Agent With 10k cr',
          'Visibility upto 5X',
          'Closing support',
          'Leads & site Visit',
          'All Marketplaces & Meta Integration',
          'Unlimited Listing & Chanakya AI',
          'Fixed Template website',
          'Potential earning opportunity of 2,50,000',
        ],
        commissionRate: 0,
        maxListings: -1,
        maxLeads: -1,
        aiToolsAccess: true,
        websiteBuilder: true,
        priority: 2,
        isActive: true,
      },
      {
        name: SubscriptionPlanType.PLUS,
        displayName: 'Plus',
        price: 9999,
        duration: 30,
        features: [
          'Unlimited Poster Agent & AI Agent With 1L cr',
          'Visibility upto 10X',
          'Closing support',
          'Leads & site Visit',
          'All Marketplaces & Meta Integration',
          'Unlimited Listing & Chanakya AI',
          'Unlimited Template website',
          'Potential earning opportunity of 5,00,000',
        ],
        commissionRate: 0,
        maxListings: -1,
        maxLeads: -1,
        aiToolsAccess: true,
        websiteBuilder: true,
        priority: 3,
        isActive: true,
      },
    ];

    await this.subscriptionPlanModel.insertMany(plans);

    return { message: 'Plans seeded successfully', count: plans.length };
  }
}
