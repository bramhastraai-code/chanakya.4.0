import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UserStatus, UserType } from './enum/usertype.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc',
    searchQuery?: string,
    userType?: UserType,
    status?: UserStatus,
  ): Promise<{
    customers: Customer[];
    totalPages: number;
    totalCustomers: number;
    pageSize: number;
    pageNumber: number;
  }> {
    console.log({
      pageSize,
      pageNumber,
      sortBy,
      sortOrder,
      searchQuery,
      userType,
      status,
    });

    try {
      const limit = parseInt(pageSize);
      const skip = (parseInt(pageNumber) - 1) * limit;
      const sortOptions: { [key: string]: 1 | -1 } = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const searchFilter: any = searchQuery
        ? {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } },
              { email: { $regex: searchQuery, $options: 'i' } },
            ],
          }
        : {};
      if (userType && userType !== 'All') {
        searchFilter.userType = userType;
      }

      if (status && status !== 'all') {
        searchFilter.status = status;
      }
      console.log('searchFilter', searchFilter);

      const totalCustomers = await this.customerModel
        .countDocuments(searchFilter)
        .exec();

      const customers = await this.customerModel
        .find(searchFilter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();

      const totalPages = Math.ceil(totalCustomers / limit);

      console.log('customers', customers);
      return {
        customers,
        totalPages,
        totalCustomers,
        pageSize: limit,
        pageNumber: parseInt(pageNumber),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Customer> {
    try {
      const customer = await this.customerModel
        .findById(id)
        .populate('assignAgent')
        .exec();

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found.`);
      }
      return customer;
    } catch (error) {
      throw error;
    }
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const existingCustomer = await this.customerModel.findOne({
        phoneNumber: createCustomerDto.phoneNumber,
      });
      if (existingCustomer) {
        throw new ConflictException('phone number  is already in use');
      }

      const createdCustomer = new this.customerModel(createCustomerDto);
      return await createdCustomer.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      const updatedCustomer = await this.customerModel
        .findByIdAndUpdate(id, updateCustomerDto, { new: true })
        .exec();
      if (!updatedCustomer) {
        throw new NotFoundException(`Customer with ID ${id} not found.`);
      }
      return updatedCustomer;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Customer> {
    try {
      const deletedCustomer = await this.customerModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedCustomer) {
        throw new NotFoundException(`Customer with ID ${id} not found.`);
      }
      return deletedCustomer;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }

  async findByMobile(phoneNumber: string): Promise<Customer> {
    return this.customerModel.findOne({ phoneNumber });
  }

  async getAppliedProjects(customerId: string) {
    try {
      const customer = await this.customerModel
        .findById(customerId)
        .populate(
          'projectsApplied',
          'projectName thumbnail city state priceMin priceMax',
        );

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      return customer.projectsApplied;
    } catch (error) {
      throw error;
    }
  }

  async getCustomersByAgentWithPagination(
    agentId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ customers: Customer[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [customers, total] = await Promise.all([
        this.customerModel
          .find({ assignAgent: agentId })
          .select(
            'name userType responseTime phoneNumber status projectsApplied address city country email latitude longitude name pinCode state userImage leadStatus',
          )
          .skip(skip)
          .limit(limit)
          .exec(),
        this.customerModel.countDocuments({ assignAgent: agentId }).exec(),
      ]);

      return { customers, total };
    } catch (error) {
      throw error;
    }
  }

  async createCustomerByAgent(
    agentId: string,
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    try {
      const existingCustomer = await this.customerModel.findOne({
        phoneNumber: createCustomerDto.phoneNumber,
      });
      if (existingCustomer) {
        throw new ConflictException('phone number is already in use');
      }

      const customerData = {
        ...createCustomerDto,
        assignAgent: agentId,
      };

      const createdCustomer = new this.customerModel(customerData);
      return await createdCustomer.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }
}
