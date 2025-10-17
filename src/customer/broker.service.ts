import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';
import { BrokerResponseDto } from './dto/broker-response.dto';
import {
  LeadStatus,
  UserStatus,
  UserType,
  VerificationStatus,
} from './enum/usertype.enum';
import { WebSocketGatewayHandler } from 'src/websocket/websocket.gateway';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateLeadStatusDto } from './dto/update-lead.status.tdo';
import { NotificationService } from 'src/firebase/firebase.service';
@Injectable()
export class BrokerService {
  private readonly logger = new Logger(BrokerService.name);
  private pendingRequests = new Map<
    string,
    { customerId: string; area: string; brokerId: string }
  >();
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private webSocketGateway: WebSocketGatewayHandler,
    private notificationService: NotificationService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  async getAllBrokersWithPerformance(): Promise<BrokerResponseDto[]> {
    const brokers = await this.customerModel
      .find({
        userType: UserType.AGENT,
        status: UserStatus.ACTIVE,
        verificationStatus: VerificationStatus.VERIFIED,
      })
      .select(
        `
        name userImage email userType 
        responseTime serviceAreas verificationStatus verificationDocuments
        licenseNumber licenseExpiry yearsOfExperience
        agencyName agencyLicense agencyFoundedYear
        teamSize rating reviewCount closedDeals
      `,
      )
      .lean()
      .exec();

    return brokers.map((broker) => {
      // Calculate performance score (adjust weights as needed)
      const performanceScore = this.calculatePerformanceScore(broker);

      return {
        ...broker,
        performanceScore,
        // Ensure proper typing for the response
        _id: broker._id.toString(),
        serviceAreas: broker.serviceAreas || [],
      } as BrokerResponseDto;
    });
  }

  private calculatePerformanceScore(broker: any): number {
    // Customize these weights based on your business requirements
    const weights = {
      rating: 0.4, // 40% weight
      closedDeals: 0.3, // 30% weight
      reviewCount: 0.2, // 20% weight
      experience: 0.1, // 10% weight
    };

    const normalizedClosedDeals = Math.min(broker.closedDeals / 100, 1);
    const normalizedReviewCount = Math.min(broker.reviewCount / 50, 1);
    const normalizedExperience = Math.min(
      (broker.yearsOfExperience || 0) / 10,
      1,
    );

    const score =
      (broker.rating || 0) * weights.rating +
      normalizedClosedDeals * weights.closedDeals +
      normalizedReviewCount * weights.reviewCount +
      normalizedExperience * weights.experience;

    return parseFloat(score.toFixed(2));
  }

  async findByServiceArea(serviceArea: string): Promise<Customer[]> {
    return this.customerModel
      .find({ serviceAreas: serviceArea })
      .select(
        `
        name userImage email userType 
        responseTime serviceAreas verificationStatus verificationDocuments
        licenseNumber licenseExpiry yearsOfExperience
        agencyName agencyLicense agencyFoundedYear
        teamSize rating reviewCount closedDeals
      `,
      )
      .exec();
  }

  async findByServiceAreas(serviceAreas: string[]): Promise<Customer[]> {
    return this.customerModel
      .find({ serviceAreas: { $in: serviceAreas } })
      .select(
        `
        name userImage email userType 
        responseTime serviceAreas verificationStatus verificationDocuments
        licenseNumber licenseExpiry yearsOfExperience
        agencyName agencyLicense agencyFoundedYear
        teamSize rating reviewCount closedDeals
      `,
      )
      .exec();
  }

  async findByAssignedAgent(agentId: string): Promise<Customer[]> {
    try {
      const customers = await this.customerModel
        .find({ assignAgent: agentId })
        .exec();

      return customers;
    } catch (error) {
      this.logger.error(
        `Failed to fetch customers for agent ID: ${agentId}`,
        error.stack,
      );
      throw error;
    }
  }

  /***
   * This function handles the broker request by storing it in pendingRequests and notifying the broker.
   * If the broker is not connected, it broadcasts the request to all brokers in the area.
   * It also sets a timeout for the request, after which it will be broadcasted to all brokers in the area.
   * @param customerId - The ID of the customer making the request.
   * @param brokerId - The ID of the broker to be notified.
   * @param area - The area where the request is being made.
   * @returns {Promise<void>}
   * @throws {Error} - Throws an error if the broker is not connected.
   * @throws {Error} - Throws an error if the request is invalid or expired.
   */
  async handleBrokerRequest(
    customerId: string,
    brokerId: string,
    area: string,
  ) {
    // Store the request
    this.pendingRequests.set(customerId, { customerId, brokerId, area });

    // Notify the specific broker
    const notified = this.webSocketGateway.sendNotificationToBroker(brokerId, {
      type: 'NEW_REQUEST',
      customerId,
      message: 'A customer wants to connect with you',
      timeout: 1 * 60 * 1000, // 10 minutes
    });

    if (!notified) {
      this.logger.warn(
        `Broker ${brokerId} not connected, moving to area broadcast`,
      );
      await this.broadcastToAreaBrokers(customerId, area);
      return;
    }

    // Schedule timeout using @nestjs/schedule dynamic API
    const timeout = setTimeout(
      () => {
        this.broadcastToAreaBrokers(customerId, area);
        this.schedulerRegistry.deleteTimeout(`request-${customerId}`);
      },
      1 * 60 * 1000,
    ); // 10 minutes

    this.schedulerRegistry.addTimeout(`request-${customerId}`, timeout);
  }

  @Cron('*/1 * * * *') // Check every 1 minutes for expired requests
  async handleExpiredRequests() {
    const now = Date.now();
    for (const [customerId, request] of this.pendingRequests) {
      const requestAge = now - (request as any)._timestamp; // Add _timestamp when creating request
      if (requestAge > 1 * 60 * 1000) {
        // 10 minutes
        await this.broadcastToAreaBrokers(customerId, request.area);
        this.pendingRequests.delete(customerId);
      }
    }
  }

  async broadcastToAreaBrokers(customerId: string, area: string) {
    this.logger.log(
      `Broadcasting request for customer ${customerId} to area ${area}`,
    );

    this.webSocketGateway.broadcastToAreaBrokers(area, {
      type: 'AREA_REQUEST',
      customerId,
      message: `New customer request in your area (${area}) - first come first serve!`,
      expiresIn: '5 minutes', // Additional urgency
    });

    // Notify admin
    this.webSocketGateway.server.emit('admin-notification', {
      type: 'BROADCAST_NOTIFICATION',
      customerId,
      area,
      timestamp: new Date().toISOString(),
    });
  }

  async acceptRequest(brokerId: string, customerId: string) {
    const request = this.pendingRequests.get(customerId);
    if (!request) {
      throw new Error('Invalid or expired request');
    }

    // Clear timeout if exists
    try {
      const timeout = this.schedulerRegistry.getTimeout(
        `request-${customerId}`,
      );
      clearTimeout(timeout);
      this.schedulerRegistry.deleteTimeout(`request-${customerId}`);
    } catch (e) {
      this.logger.warn(`No timeout found for customer ${customerId}`);
    }

    // Assign broker
    await this.customerModel.findByIdAndUpdate(customerId, {
      assignAgent: brokerId,
      $push: {
        assignmentHistory: { brokerId, timestamp: new Date(), method: 'auto' },
      },
    });

    this.pendingRequests.delete(customerId);

    // Notifications
    this.webSocketGateway.server.emit('admin-notification', {
      type: 'ASSIGNMENT_CONFIRMATION',
      customerId,
      brokerId,
    });

    return { success: true, assignedBroker: brokerId };
  }

  @Cron('0 9 * * 1-5') // Weekdays at 9 AM - cleanup job
  async cleanupPendingRequests() {
    const expiredThreshold = Date.now() - 30 * 60 * 1000; // 30 minutes
    for (const [customerId, request] of this.pendingRequests) {
      if ((request as any)._timestamp < expiredThreshold) {
        this.pendingRequests.delete(customerId);
        this.logger.log(
          `Cleaned up expired request for customer ${customerId}`,
        );
      }
    }
  }
  async manuallyAssignBroker(
    adminId: string,
    customerId: string,
    brokerId: string,
  ) {
    await this.customerModel.findByIdAndUpdate(customerId, {
      assignAgent: brokerId,
    });

    this.pendingRequests.delete(customerId);

    this.webSocketGateway.server.emit('admin-notification', {
      type: 'MANUAL_ASSIGNMENT',
      adminId,
      customerId,
      brokerId,
      message: `Admin manually assigned broker ${brokerId} to customer ${customerId}`,
    });

    return { success: true, message: 'Broker manually assigned' };
  }

  /**
   * Update broker details
   */
  async updateBroker(
    id: string,
    updateBrokerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      const updatedBroker = await this.customerModel
        .findByIdAndUpdate(id, updateBrokerDto, { new: true })
        .exec();
      if (!updatedBroker) {
        throw new NotFoundException(`Broker with ID ${id} not found.`);
      }
      return updatedBroker;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }

  /**
   * Get broker details by ID
   */
  async getBrokerById(id: string): Promise<Customer> {
    try {
      const broker = await this.customerModel.findById(id).exec();
      if (!broker) {
        throw new NotFoundException(`Broker with ID ${id} not found.`);
      }
      return broker;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }
  // update lead status for a particular broker
  async updateLeadStatus(
    customerId: string,
    updateLeadStatusDto: UpdateLeadStatusDto,
    updatedBy: string, // ID of the user making the update
  ): Promise<Customer> {
    const customer = await this.customerModel.findById(customerId).exec();

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // You might want to add additional validation here
    // For example, check if the user making the request is the assigned agent

    // Create a status history entry
    // const statusHistoryEntry = {
    //   previousStatus: customer.contactStatus as LeadStatus,
    //   newStatus: updateLeadStatusDto.status,
    //   changedBy: updatedBy,
    //   changedAt: new Date(),
    //   notes: updateLeadStatusDto.notes,
    // };

    // Update the customer with new status and add to history
    return this.customerModel
      .findByIdAndUpdate(
        customerId,
        {
          $set: { contactStatus: updateLeadStatusDto.status },
          // $push: { statusHistory: statusHistoryEntry },
        },
        { new: true },
      )
      .exec();
  }

  /**
   * assignment  abrker to customer flow push notificationmethod
   */

  async handleBrokerConnectionRequest(
    customerId: string,
    brokerId: string,
    action: 'accept' | 'reject',
    brokerName: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const customer = await this.customerModel.findById(customerId);

      if (!customer) {
        return { success: false, message: 'Customer not found' };
      }

      // Check if customer already has an assigned broker
      if (action === 'accept' && customer.assignAgent) {
        const timeDiff = Date.now() - customer.updatedAt.getTime();
        const minutesAgo = Math.floor(timeDiff / (1000 * 60));

        await this.notificationService.sendPushNotification(
          brokerId,
          'Connection Request',
          `This customer is already connected with another broker ${minutesAgo} minutes ago`,
        );

        // Also notify the customer
        await this.notificationService.sendPushNotification(
          customerId,
          'Connection Update',
          `${brokerName} tried to connect but you're already connected`,
        );

        return {
          success: false,
          message: `Customer already connected with another broker ${minutesAgo} minutes ago`,
        };
      }

      if (action === 'accept') {
        // Update customer's assigned broker
        customer.assignAgent = brokerId;
        customer.contactStatus = LeadStatus.CONTACTED;

        // Add to status history
        customer.statusHistory.push({
          previousStatus: LeadStatus.NEW,
          newStatus: LeadStatus.CONTACTED,
          changedBy: brokerId,
          changedAt: new Date(),
          notes: `Broker ${brokerName} accepted connection request`,
        });

        await customer.save();

        // Send notification to customer
        await this.notificationService.sendPushNotification(
          customerId,
          'Connection Accepted',
          `${brokerName} has accepted your connection request`,
          { brokerId, action: 'accepted' },
        );

        return {
          success: true,
          message: 'Successfully connected with customer',
        };
      } else {
        // Handle rejection
        customer.statusHistory.push({
          previousStatus: customer.contactStatus as LeadStatus,
          newStatus: LeadStatus.CALL_LATER,
          changedBy: brokerId,
          changedAt: new Date(),
          notes: `Broker ${brokerName} rejected connection request`,
        });

        await customer.save();

        // Send notification to customer
        await this.notificationService.sendPushNotification(
          customerId,
          'Connection Rejected',
          `${brokerName} has declined your connection request`,
          { brokerId, action: 'rejected' },
        );

        return {
          success: true,
          message: 'Connection request rejected',
        };
      }
    } catch (error) {
      this.logger.error(
        `Error handling broker connection request for customer ${customerId}`,
        error.stack,
      );
      return {
        success: false,
        message: 'An error occurred while processing the request',
      };
    }
  }

  // Additional method to initiate connection request
  async sendBrokerConnectionRequest(
    customerId: string,
    brokerId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const customer = await this.customerModel.findById(customerId);

      if (!customer) {
        return { success: false, message: 'Customer not found' };
      }

      // Update customer status to indicate request sent
      customer.contactStatus = LeadStatus.NEW;
      customer.statusHistory.push({
        previousStatus: LeadStatus.NEW,
        newStatus: LeadStatus.NEW,
        changedBy: customerId, // or system if initiated by system
        changedAt: new Date(),
        notes: `Connection request sent to broker ${brokerId}`,
      });

      await customer.save();

      // Send notification to broker
      await this.notificationService.sendPushNotification(
        brokerId,
        'New Connection Request',
        `${customer.name} wants to connect with you`,
        { customerId, action: 'connection_request' },
      );

      return {
        success: true,
        message: 'Connection request sent to broker',
      };
    } catch (error) {
      this.logger.error(
        `Error sending broker connection request for customer ${customerId}`,
        error.stack,
      );
      return {
        success: false,
        message: 'An error occurred while sending the request',
      };
    }
  }
}
