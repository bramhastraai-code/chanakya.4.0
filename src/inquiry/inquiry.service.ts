import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { Property } from '../property/entities/property.entity';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectModel(Inquiry.name) private readonly inquiryModel: Model<Inquiry>,
    @InjectModel(Property.name) private readonly propertyModel: Model<Property>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
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
    status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
    projectId?: string,
    propertyId?: string,
    builderId?: string,
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

    // Filter by projectId directly
    if (projectId) {
      query.projectId = new Types.ObjectId(projectId);
    }

    // Filter by propertyId directly
    if (propertyId) {
      query.propertyId = new Types.ObjectId(propertyId);
    }

    // Filter by builderId - find projects/properties by builder, then filter inquiries
    if (builderId) {
      const builderObjectId = new Types.ObjectId(builderId);
      
      // Find all projects by this builder
      const builderProjects = await this.projectModel
        .find({ builder: builderObjectId })
        .distinct('_id');
      
      // Find all properties by this builder
      const builderProperties = await this.propertyModel
        .find({ builder: builderObjectId })
        .distinct('_id');
      
      // Filter inquiries that reference these projects or properties
      query.$or = [
        { projectId: { $in: builderProjects } },
        { propertyId: { $in: builderProperties } },
      ];
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
