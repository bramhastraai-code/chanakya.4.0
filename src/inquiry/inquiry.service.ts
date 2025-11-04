import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Customer } from 'src/customer/entities/customer.entity';

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
  
}
