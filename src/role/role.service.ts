import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entity/role.entity';

type SortOrder = 'asc' | 'desc';

interface SortOptions {
  [key: string]: SortOrder;
}
@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  //---------------crud operation------------------------------------------
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async findAll({
    page,
    limit,
    sortBy,
    sortOrder,
    name,
  }: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: string;
    name?: string;
  }): Promise<{
    roles: Role[];
    pageSize: number;
    pageNumber: number;
    totalPages: number;
    totalRoles: number;
  }> {
    // Build the query object
    const query: any = {};
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }

    // Sort options
    const sortOptions: SortOptions = {
      [sortBy || 'name']: (sortOrder as 'asc' | 'desc') || 'asc',
    };

    // Fetch total number of roles that match the query
    const totalRoles = await this.roleModel.countDocuments(query).exec();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRoles / limit);

    // Fetch the roles with pagination
    const roles = await this.roleModel
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // Return roles along with pagination info
    return {
      roles,
      pageSize: limit,
      pageNumber: page,
      totalPages,
      totalRoles,
    };
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRoleDto> {
    const updatedRole = await this.roleModel
      .findByIdAndUpdate(id, updateRoleDto, { new: true })
      .exec();
    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return updatedRole;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
  /**---------------------------extra logics---------------------------*/

  async roleList(): Promise<{
    roles: Role[];
  }> {
    const roles = await this.roleModel.find().exec();
    return { roles };
  }
}
