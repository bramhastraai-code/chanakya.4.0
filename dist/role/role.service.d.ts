import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entity/role.entity';
export declare class RoleService {
    private roleModel;
    constructor(roleModel: Model<Role>);
    create(createRoleDto: CreateRoleDto): Promise<Role>;
    findAll({ page, limit, sortBy, sortOrder, name, }: {
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
    }>;
    findOne(id: string): Promise<Role>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<UpdateRoleDto>;
    remove(id: string): Promise<void>;
    roleList(): Promise<{
        roles: Role[];
    }>;
}
