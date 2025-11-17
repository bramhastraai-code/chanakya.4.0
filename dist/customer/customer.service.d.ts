import { Model } from 'mongoose';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserStatus, UserType } from './enum/usertype.enum';
export declare class CustomerService {
    private customerModel;
    constructor(customerModel: Model<Customer>);
    findAll(pageSize: string, pageNumber: string, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery?: string, userType?: UserType, status?: UserStatus): Promise<{
        customers: Customer[];
        totalPages: number;
        totalCustomers: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Customer>;
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
    remove(id: string): Promise<Customer>;
    findByMobile(phoneNumber: string): Promise<Customer>;
    getAppliedProjects(customerId: string): Promise<string[]>;
    getCustomersByAgentWithPagination(agentId: string, page?: number, limit?: number): Promise<{
        customers: Customer[];
        total: number;
    }>;
    createCustomerByAgent(agentId: string, createCustomerDto: CreateCustomerDto): Promise<Customer>;
}
