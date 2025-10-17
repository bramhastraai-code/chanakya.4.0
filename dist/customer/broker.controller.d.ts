import { BrokerResponseDto } from './dto/broker-response.dto';
import { BrokerService } from './broker.service';
import { Response } from 'src/common/interceptor/response.interface';
import { Customer } from './entities/customer.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateLeadStatusDto } from './dto/update-lead.status.tdo';
import { HandleBrokerConnectionDto } from './dto/handleConnection.dto';
export declare class BrokerController {
    private readonly brokerService;
    constructor(brokerService: BrokerService);
    getBrokersWithPerformance(): Promise<Response<BrokerResponseDto[]>>;
    getByServiceArea(area: string): Promise<Response<Customer[]>>;
    getByServiceAreas(areas: string): Promise<Response<Customer[]>>;
    findByAssignedAgent(req: any): Promise<Response<Customer[]>>;
    requestBroker(body: {
        customerId: string;
        area: string;
    }, brokerId: string): Promise<{
        data: void;
        message: string;
    }>;
    acceptRequest(customerId: string, body: {
        brokerId: string;
    }): Promise<{
        data: {
            success: boolean;
            assignedBroker: string;
        };
        message: string;
    }>;
    manualAssign(customerId: string, body: {
        brokerId: string;
        adminId: string;
    }): Promise<{
        data: {
            success: boolean;
            message: string;
        };
        message: string;
    }>;
    update(req: any, updateCustomerDto: UpdateCustomerDto): Promise<Response<Customer>>;
    getBrokerById(req: any): Promise<Response<Customer>>;
    updateLeadStatus(customerId: string, updateLeadStatusDto: UpdateLeadStatusDto, req: any): Promise<Response<Customer>>;
    sendBrokerConnectionRequest(req: any, brokerId: string): Promise<{
        data: {
            success: boolean;
            message: string;
        };
        message: string;
    }>;
    handleBrokerConnectionRequest(customerId: string, req: any, handleConnectionDto: HandleBrokerConnectionDto): Promise<{
        data: {
            success: boolean;
            message: string;
        };
        message: string;
    }>;
    sendBrokerConnectionRequesTestt(customerId: string, brokerId: string): Promise<{
        data: {
            success: boolean;
            message: string;
        };
        message: string;
    }>;
}
