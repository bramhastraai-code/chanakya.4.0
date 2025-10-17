import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AgentInquiry } from './entities/agent-inquiry.entity';
import { CreateAgentInquiryDto } from './dto/create-agent-inquiry.dto';
import { UpdateAgentInquiryDto } from './dto/update-agent-inquiry.dto';
import { Status } from 'src/common/enum/status.enum';

@Injectable()
export class AgentInquiryService {
  constructor(
    @InjectModel(AgentInquiry.name)
    private agentInquiryModel: Model<AgentInquiry>,
  ) {}

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc',
    searchQuery?: string,
    status?: Status,
  ) {
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
              { phoneNumber: { $regex: searchQuery, $options: 'i' } },
            ],
          }
        : {};
      if (status && status !== 'all') {
        searchFilter.status = status;
      }

      const totalInquiries = await this.agentInquiryModel
        .countDocuments(searchFilter)
        .exec();
      const inquiries = await this.agentInquiryModel
        .find(searchFilter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();

      return {
        inquiries,
        totalPages: Math.ceil(totalInquiries / limit),
        totalInquiries,
        pageSize: limit,
        pageNumber: parseInt(pageNumber),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching agent inquiries');
    }
  }

  async findOne(id: string): Promise<AgentInquiry> {
    try {
      const inquiry = await this.agentInquiryModel.findById(id).exec();
      if (!inquiry) {
        throw new NotFoundException(`Inquiry with ID ${id} not found.`);
      }
      return inquiry;
    } catch (error) {
      throw error;
    }
  }

  async create(
    createAgentInquiryDto: CreateAgentInquiryDto,
  ): Promise<AgentInquiry> {
    try {
      const existingInquiry = await this.agentInquiryModel.findOne({
        phoneNumber: createAgentInquiryDto.phoneNumber,
      });
      if (existingInquiry) {
        throw new ConflictException('Phone number is already in use');
      }
      const createdInquiry = new this.agentInquiryModel(createAgentInquiryDto);
      return await createdInquiry.save();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateAgentInquiryDto: UpdateAgentInquiryDto,
  ): Promise<AgentInquiry> {
    try {
      const updatedInquiry = await this.agentInquiryModel
        .findByIdAndUpdate(id, updateAgentInquiryDto, { new: true })
        .exec();
      if (!updatedInquiry) {
        throw new NotFoundException(`Inquiry with ID ${id} not found.`);
      }
      return updatedInquiry;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<AgentInquiry> {
    try {
      const deletedInquiry = await this.agentInquiryModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedInquiry) {
        throw new NotFoundException(`Inquiry with ID ${id} not found.`);
      }
      return deletedInquiry;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw new InternalServerErrorException('Error deleting the inquiry');
    }
  }

  async addAgentForm(
    createAgentInquiryDto: CreateAgentInquiryDto,
  ): Promise<AgentInquiry> {
    try {
      const createdInquiry = new this.agentInquiryModel(createAgentInquiryDto);
      return await createdInquiry.save();
    } catch (error) {
      throw error;
    }
  }
}
