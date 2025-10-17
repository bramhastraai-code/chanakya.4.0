import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { UserStatus, UserType } from './enum/usertype.enum';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    findAll(pageSize: string, pageNumber: string, sortBy: string, sortOrder: 'desc' | 'asc', searchQuery?: string, userType?: UserType, status?: UserStatus): Promise<Response<{
        customers: Customer[];
        totalPages: number;
        totalCustomers: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Customer>>;
    create(createCustomerDto: CreateCustomerDto): Promise<Response<Customer>>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Response<Customer>>;
    remove(id: string): Promise<Customer>;
    getAppliedProjects(customerId: string): Promise<{
        data: string[];
        message: string;
    }>;
    findCustomerProfile(req: any): Promise<Response<Customer>>;
    getCustomersByAgentWithPagination(req: any, page?: number, limit?: number): Promise<Response<{
        customers: Customer[];
        total: number;
    }>>;
    createCustomerByAgent(req: any, createCustomerDto: CreateCustomerDto): Promise<Response<Customer>>;
}
