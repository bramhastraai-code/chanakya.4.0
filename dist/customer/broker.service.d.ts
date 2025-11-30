/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Customer } from './entities/customer.entity';
import { Model } from 'mongoose';
import { BrokerResponseDto } from './dto/broker-response.dto';
import { WebSocketGatewayHandler } from 'src/websocket/websocket.gateway';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateLeadStatusDto } from './dto/update-lead.status.tdo';
import { NotificationService } from 'src/firebase/firebase.service';
export declare class BrokerService {
    private customerModel;
    private webSocketGateway;
    private notificationService;
    private schedulerRegistry;
    private readonly logger;
    private pendingRequests;
    constructor(customerModel: Model<Customer>, webSocketGateway: WebSocketGatewayHandler, notificationService: NotificationService, schedulerRegistry: SchedulerRegistry);
    getAllBrokersWithPerformance(): Promise<BrokerResponseDto[]>;
    private calculatePerformanceScore;
    findByServiceArea(serviceArea: string): Promise<Customer[]>;
    findByServiceAreas(serviceAreas: string[]): Promise<Customer[]>;
    findByAssignedAgent(agentId: string): Promise<Customer[]>;
    handleBrokerRequest(customerId: string, brokerId: string, area: string): Promise<void>;
    handleExpiredRequests(): Promise<void>;
    broadcastToAreaBrokers(customerId: string, area: string): Promise<void>;
    acceptRequest(brokerId: string, customerId: string): Promise<{
        success: boolean;
        assignedBroker: string;
    }>;
    cleanupPendingRequests(): Promise<void>;
    manuallyAssignBroker(adminId: string, customerId: string, brokerId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateBroker(id: string, updateBrokerDto: UpdateCustomerDto): Promise<Customer>;
    getBrokerById(id: string): Promise<Customer>;
    updateLeadStatus(customerId: string, updateLeadStatusDto: UpdateLeadStatusDto, updatedBy: string): Promise<Customer>;
    handleBrokerConnectionRequest(customerId: string, brokerId: string, action: 'accept' | 'reject', brokerName: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendBrokerConnectionRequest(customerId: string, brokerId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
