// src/builders/builders.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserType } from './enum/usertype.enum';
import { Customer } from './entities/customer.entity';
import { UpdateBuilderDto } from './dto/create-builder.dto';

@Injectable()
export class BuildersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find({ userType: UserType.BUILDER }).exec();
  }

  async findOne(id: string): Promise<Customer> {
    const builder = await this.customerModel.findOne({
      _id: id,
      userType: UserType.BUILDER,
    });
    return builder;
  }

  async update(
    id: string,
    updateBuilderDto: UpdateBuilderDto,
  ): Promise<Customer> {
    const updatedBuilder = await this.customerModel.findOneAndUpdate(
      { _id: id, userType: UserType.BUILDER },
      updateBuilderDto,
      { new: true },
    );
    return updatedBuilder;
  }
}
