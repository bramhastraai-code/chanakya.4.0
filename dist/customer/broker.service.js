"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BrokerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const customer_entity_1 = require("./entities/customer.entity");
const mongoose_2 = require("mongoose");
const usertype_enum_1 = require("./enum/usertype.enum");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const schedule_1 = require("@nestjs/schedule");
const firebase_service_1 = require("../firebase/firebase.service");
let BrokerService = BrokerService_1 = class BrokerService {
    constructor(customerModel, webSocketGateway, notificationService, schedulerRegistry) {
        this.customerModel = customerModel;
        this.webSocketGateway = webSocketGateway;
        this.notificationService = notificationService;
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(BrokerService_1.name);
        this.pendingRequests = new Map();
    }
    async getAllBrokersWithPerformance() {
        const brokers = await this.customerModel
            .find({
            userType: usertype_enum_1.UserType.AGENT,
            status: usertype_enum_1.UserStatus.ACTIVE,
            verificationStatus: usertype_enum_1.VerificationStatus.VERIFIED,
        })
            .select(`
        name userImage email userType 
        responseTime serviceAreas verificationStatus verificationDocuments
        licenseNumber licenseExpiry yearsOfExperience
        agencyName agencyLicense agencyFoundedYear
        teamSize rating reviewCount closedDeals
      `)
            .lean()
            .exec();
        return brokers.map((broker) => {
            const performanceScore = this.calculatePerformanceScore(broker);
            return {
                ...broker,
                performanceScore,
                _id: broker._id.toString(),
                serviceAreas: broker.serviceAreas || [],
            };
        });
    }
    calculatePerformanceScore(broker) {
        const weights = {
            rating: 0.4,
            closedDeals: 0.3,
            reviewCount: 0.2,
            experience: 0.1,
        };
        const normalizedClosedDeals = Math.min(broker.closedDeals / 100, 1);
        const normalizedReviewCount = Math.min(broker.reviewCount / 50, 1);
        const normalizedExperience = Math.min((broker.yearsOfExperience || 0) / 10, 1);
        const score = (broker.rating || 0) * weights.rating +
            normalizedClosedDeals * weights.closedDeals +
            normalizedReviewCount * weights.reviewCount +
            normalizedExperience * weights.experience;
        return parseFloat(score.toFixed(2));
    }
    async findByServiceArea(serviceArea) {
        return this.customerModel
            .find({ serviceAreas: serviceArea })
            .select(`
        name userImage email userType 
        responseTime serviceAreas verificationStatus verificationDocuments
        licenseNumber licenseExpiry yearsOfExperience
        agencyName agencyLicense agencyFoundedYear
        teamSize rating reviewCount closedDeals
      `)
            .exec();
    }
    async findByServiceAreas(serviceAreas) {
        return this.customerModel
            .find({ serviceAreas: { $in: serviceAreas } })
            .select(`
        name userImage email userType 
        responseTime serviceAreas verificationStatus verificationDocuments
        licenseNumber licenseExpiry yearsOfExperience
        agencyName agencyLicense agencyFoundedYear
        teamSize rating reviewCount closedDeals
      `)
            .exec();
    }
    async findByAssignedAgent(agentId) {
        try {
            const customers = await this.customerModel
                .find({ assignAgent: agentId })
                .exec();
            return customers;
        }
        catch (error) {
            this.logger.error(`Failed to fetch customers for agent ID: ${agentId}`, error.stack);
            throw error;
        }
    }
    async handleBrokerRequest(customerId, brokerId, area) {
        this.pendingRequests.set(customerId, { customerId, brokerId, area });
        const notified = this.webSocketGateway.sendNotificationToBroker(brokerId, {
            type: 'NEW_REQUEST',
            customerId,
            message: 'A customer wants to connect with you',
            timeout: 1 * 60 * 1000,
        });
        if (!notified) {
            this.logger.warn(`Broker ${brokerId} not connected, moving to area broadcast`);
            await this.broadcastToAreaBrokers(customerId, area);
            return;
        }
        const timeout = setTimeout(() => {
            this.broadcastToAreaBrokers(customerId, area);
            this.schedulerRegistry.deleteTimeout(`request-${customerId}`);
        }, 1 * 60 * 1000);
        this.schedulerRegistry.addTimeout(`request-${customerId}`, timeout);
    }
    async handleExpiredRequests() {
        const now = Date.now();
        for (const [customerId, request] of this.pendingRequests) {
            const requestAge = now - request._timestamp;
            if (requestAge > 1 * 60 * 1000) {
                await this.broadcastToAreaBrokers(customerId, request.area);
                this.pendingRequests.delete(customerId);
            }
        }
    }
    async broadcastToAreaBrokers(customerId, area) {
        this.logger.log(`Broadcasting request for customer ${customerId} to area ${area}`);
        this.webSocketGateway.broadcastToAreaBrokers(area, {
            type: 'AREA_REQUEST',
            customerId,
            message: `New customer request in your area (${area}) - first come first serve!`,
            expiresIn: '5 minutes',
        });
        this.webSocketGateway.server.emit('admin-notification', {
            type: 'BROADCAST_NOTIFICATION',
            customerId,
            area,
            timestamp: new Date().toISOString(),
        });
    }
    async acceptRequest(brokerId, customerId) {
        const request = this.pendingRequests.get(customerId);
        if (!request) {
            throw new Error('Invalid or expired request');
        }
        try {
            const timeout = this.schedulerRegistry.getTimeout(`request-${customerId}`);
            clearTimeout(timeout);
            this.schedulerRegistry.deleteTimeout(`request-${customerId}`);
        }
        catch (e) {
            this.logger.warn(`No timeout found for customer ${customerId}`);
        }
        await this.customerModel.findByIdAndUpdate(customerId, {
            assignAgent: brokerId,
            $push: {
                assignmentHistory: { brokerId, timestamp: new Date(), method: 'auto' },
            },
        });
        this.pendingRequests.delete(customerId);
        this.webSocketGateway.server.emit('admin-notification', {
            type: 'ASSIGNMENT_CONFIRMATION',
            customerId,
            brokerId,
        });
        return { success: true, assignedBroker: brokerId };
    }
    async cleanupPendingRequests() {
        const expiredThreshold = Date.now() - 30 * 60 * 1000;
        for (const [customerId, request] of this.pendingRequests) {
            if (request._timestamp < expiredThreshold) {
                this.pendingRequests.delete(customerId);
                this.logger.log(`Cleaned up expired request for customer ${customerId}`);
            }
        }
    }
    async manuallyAssignBroker(adminId, customerId, brokerId) {
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
    async updateBroker(id, updateBrokerDto) {
        try {
            const updatedBroker = await this.customerModel
                .findByIdAndUpdate(id, updateBrokerDto, { new: true })
                .exec();
            if (!updatedBroker) {
                throw new common_1.NotFoundException(`Broker with ID ${id} not found.`);
            }
            return updatedBroker;
        }
        catch (error) {
            if (error.name === 'CastError') {
                throw new common_1.BadRequestException(`Invalid ID format: ${id}`);
            }
            throw error;
        }
    }
    async getBrokerById(id) {
        try {
            const broker = await this.customerModel.findById(id).exec();
            if (!broker) {
                throw new common_1.NotFoundException(`Broker with ID ${id} not found.`);
            }
            return broker;
        }
        catch (error) {
            if (error.name === 'CastError') {
                throw new common_1.BadRequestException(`Invalid ID format: ${id}`);
            }
            throw error;
        }
    }
    async updateLeadStatus(customerId, updateLeadStatusDto, updatedBy) {
        const customer = await this.customerModel.findById(customerId).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${customerId} not found`);
        }
        return this.customerModel
            .findByIdAndUpdate(customerId, {
            $set: { contactStatus: updateLeadStatusDto.status },
        }, { new: true })
            .exec();
    }
    async handleBrokerConnectionRequest(customerId, brokerId, action, brokerName) {
        try {
            const customer = await this.customerModel.findById(customerId);
            if (!customer) {
                return { success: false, message: 'Customer not found' };
            }
            if (action === 'accept' && customer.assignAgent) {
                const timeDiff = Date.now() - customer.updatedAt.getTime();
                const minutesAgo = Math.floor(timeDiff / (1000 * 60));
                await this.notificationService.sendPushNotification(brokerId, 'Connection Request', `This customer is already connected with another broker ${minutesAgo} minutes ago`);
                await this.notificationService.sendPushNotification(customerId, 'Connection Update', `${brokerName} tried to connect but you're already connected`);
                return {
                    success: false,
                    message: `Customer already connected with another broker ${minutesAgo} minutes ago`,
                };
            }
            if (action === 'accept') {
                customer.assignAgent = brokerId;
                customer.contactStatus = usertype_enum_1.LeadStatus.CONTACTED;
                customer.statusHistory.push({
                    previousStatus: usertype_enum_1.LeadStatus.NEW,
                    newStatus: usertype_enum_1.LeadStatus.CONTACTED,
                    changedBy: brokerId,
                    changedAt: new Date(),
                    notes: `Broker ${brokerName} accepted connection request`,
                });
                await customer.save();
                await this.notificationService.sendPushNotification(customerId, 'Connection Accepted', `${brokerName} has accepted your connection request`, { brokerId, action: 'accepted' });
                return {
                    success: true,
                    message: 'Successfully connected with customer',
                };
            }
            else {
                customer.statusHistory.push({
                    previousStatus: customer.contactStatus,
                    newStatus: usertype_enum_1.LeadStatus.CALL_LATER,
                    changedBy: brokerId,
                    changedAt: new Date(),
                    notes: `Broker ${brokerName} rejected connection request`,
                });
                await customer.save();
                await this.notificationService.sendPushNotification(customerId, 'Connection Rejected', `${brokerName} has declined your connection request`, { brokerId, action: 'rejected' });
                return {
                    success: true,
                    message: 'Connection request rejected',
                };
            }
        }
        catch (error) {
            this.logger.error(`Error handling broker connection request for customer ${customerId}`, error.stack);
            return {
                success: false,
                message: 'An error occurred while processing the request',
            };
        }
    }
    async sendBrokerConnectionRequest(customerId, brokerId) {
        try {
            const customer = await this.customerModel.findById(customerId);
            if (!customer) {
                return { success: false, message: 'Customer not found' };
            }
            customer.contactStatus = usertype_enum_1.LeadStatus.NEW;
            customer.statusHistory.push({
                previousStatus: usertype_enum_1.LeadStatus.NEW,
                newStatus: usertype_enum_1.LeadStatus.NEW,
                changedBy: customerId,
                changedAt: new Date(),
                notes: `Connection request sent to broker ${brokerId}`,
            });
            await customer.save();
            await this.notificationService.sendPushNotification(brokerId, 'New Connection Request', `${customer.name} wants to connect with you`, { customerId, action: 'connection_request' });
            return {
                success: true,
                message: 'Connection request sent to broker',
            };
        }
        catch (error) {
            this.logger.error(`Error sending broker connection request for customer ${customerId}`, error.stack);
            return {
                success: false,
                message: 'An error occurred while sending the request',
            };
        }
    }
};
exports.BrokerService = BrokerService;
__decorate([
    (0, schedule_1.Cron)('*/1 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrokerService.prototype, "handleExpiredRequests", null);
__decorate([
    (0, schedule_1.Cron)('0 9 * * 1-5'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrokerService.prototype, "cleanupPendingRequests", null);
exports.BrokerService = BrokerService = BrokerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_entity_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        websocket_gateway_1.WebSocketGatewayHandler,
        firebase_service_1.NotificationService,
        schedule_1.SchedulerRegistry])
], BrokerService);
//# sourceMappingURL=broker.service.js.map