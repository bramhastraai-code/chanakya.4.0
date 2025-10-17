import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import {
  UpdateBrokerInquiryDto,
  UpdateInquiryDto,
} from './dto/update-inquiry.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { CreateBrokerInquiryDto } from './dto/create-agent-inquiry.dto';
import { UserStatus } from 'src/customer/enum/usertype.enum';

@Injectable()
export class InquiryService {
  constructor(
    @InjectModel(Inquiry.name) private readonly inquiryModel: Model<Inquiry>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}
  async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    try {
      const createdInquiry = new this.inquiryModel(createInquiryDto);
      return createdInquiry.save();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateInquiryDto: UpdateInquiryDto,
  ): Promise<Inquiry | null> {
    const updatedInquiry = await this.inquiryModel.findByIdAndUpdate(
      id,
      updateInquiryDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedInquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    return updatedInquiry;
  }

  async findAll(
    pageSize: string = '10',
    pageNumber: string = '1',
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    searchQuery?: string,
    inquiryType?:
      | 'common'
      | 'groupBuy'
      | 'agentSelection'
      | 'quickBuy'
      | 'siteVisit',
    status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED', // Optional status filter
  ): Promise<{
    inquiries: Inquiry[];
    totalPages: number;
    totalInquiries: number;
    pageSize: number;
    pageNumber: number;
  }> {
    const limit = parseInt(pageSize, 10);
    const skip = (parseInt(pageNumber, 10) - 1) * limit;

    const query: any = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { message: { $regex: searchQuery, $options: 'i' } },
        { contactNumber: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (inquiryType) {
      query.inquiryType = inquiryType;
    }

    if (status) {
      query.status = status;
    }

    const inquiries = await this.inquiryModel
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const totalInquiries = await this.inquiryModel.countDocuments(query);
    const totalPages = Math.ceil(totalInquiries / limit);

    return {
      inquiries,
      totalPages,
      totalInquiries,
      pageSize: limit,
      pageNumber: parseInt(pageNumber, 10),
    };
  }

  async findOne(id: string): Promise<Inquiry | null> {
    return this.inquiryModel.findById(id).exec();
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    const result = await this.inquiryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Inquiry not found');
    }
    return result;
  }

  async findByCustomerId(
    customerId: string,
    pageSize: string = '10',
    pageNumber: string = '1',
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const limit = parseInt(pageSize, 10);
    const skip = (parseInt(pageNumber, 10) - 1) * limit;

    // Convert customerId to ObjectId if needed
    const query = {
      userId: new Types.ObjectId(customerId),
    };

    try {
      const inquiries = await this.inquiryModel
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'projectId',
          options: { strictPopulate: false },
        })
        .populate({
          path: 'propertyId',
          options: { strictPopulate: false },
        })
        .exec();

      const totalInquiries = await this.inquiryModel.countDocuments(query);
      const totalPages = Math.ceil(totalInquiries / limit);

      return {
        inquiries,
        totalPages,
        totalInquiries,
        pageSize: limit,
        pageNumber: parseInt(pageNumber, 10),
      };
    } catch (error) {
      // Handle potential errors (like invalid ObjectId format)
      throw new Error(`Error finding inquiries: ${error.message}`);
    }
  }

  async createInquiry(
    createInquiryDto: CreateBrokerInquiryDto,
    agentId: string,
  ) {
    const { contactNumber, name, address, city, ...inquiryData } =
      createInquiryDto;

    // Find or create customer
    let customer = await this.customerModel.findOne({
      phoneNumber: contactNumber,
    });

    if (!customer) {
      // Create new customer with basic details
      customer = await this.customerModel.create({
        phoneNumber: contactNumber,
        name: name || 'Unknown',
        address: address || '',
        city: city || '',
        assignAgent: agentId,
        userType: 'User',
        status: UserStatus.ACTIVE,
      });
    } else {
      // Update assignAgent if not already set
      if (!customer.assignAgent) {
        customer.assignAgent = new Types.ObjectId(agentId);
        await customer.save();
      }
    }

    // Create inquiry
    const inquiry = await this.inquiryModel.create({
      ...inquiryData,
      userId: customer._id,
      contactNumber,
      status: 'PENDING',
    });

    return inquiry;
  }

  async updateInquiry(
    id: string,
    updateInquiryDto: UpdateBrokerInquiryDto,
    agentId: string,
  ) {
    const { contactNumber, name, address, city, ...inquiryData } =
      updateInquiryDto;

    // First find the inquiry
    const inquiry = await this.inquiryModel.findById(id);
    if (!inquiry) {
      throw new Error('Inquiry not found');
    }

    let customer;
    if (contactNumber && contactNumber !== inquiry.contactNumber) {
      // Check if new contact number exists
      customer = await this.customerModel.findOne({
        phoneNumber: contactNumber,
      });

      if (!customer) {
        // Create new customer with basic details if contact number changed and not found
        customer = await this.customerModel.create({
          phoneNumber: contactNumber,
          name: name || 'Unknown',
          address: address || '',
          city: city || '',
          assignAgent: agentId,
          userType: 'USER',
          status: UserStatus.ACTIVE,
          verificationStatus: 'PENDING',
        });
      }

      // Update inquiry with new customer ID if contact number changed
      inquiry.userId = customer._id;
      inquiry.contactNumber = contactNumber;
    } else {
      // If contact number didn't change, get the existing customer
      customer = await this.customerModel.findById(inquiry.userId);
    }

    // Update customer details if provided
    if (customer) {
      const customerUpdates: Partial<Customer> = {};

      if (name) customerUpdates.name = name;
      if (address) customerUpdates.address = address;
      if (city) customerUpdates.city = city;

      // Update assignAgent if not already set
      if (!customer.assignAgent) {
        customerUpdates.assignAgent = new Types.ObjectId(agentId);
      }

      if (Object.keys(customerUpdates).length > 0) {
        await this.customerModel.findByIdAndUpdate(
          customer._id,
          customerUpdates,
          { new: true },
        );
      }
    }

    // Update inquiry
    const updatedInquiry = await this.inquiryModel
      .findByIdAndUpdate(
        id,
        {
          ...inquiryData,
          userId: inquiry.userId, // Keep existing or updated user ID
        },
        { new: true },
      )
      .populate('userId');

    return updatedInquiry;
  }
}
