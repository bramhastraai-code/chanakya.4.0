import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { Role } from './entity/role.entity';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    create(createRoleDto: CreateRoleDto): Promise<{
        data: Role;
        message: string;
    }>;
    findAll(page: number, limit: number, sortBy?: string, sortOrder?: string, name?: string): Promise<{
        data: {
            roles: Role[];
            pageSize: number;
            pageNumber: number;
            totalPages: number;
            totalRoles: number;
        };
        message: string;
    }>;
    findOne(id: string): Promise<{
        data: Role;
        message: string;
    }>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        data: UpdateRoleDto;
        message: string;
    }>;
    remove(id: string): Promise<void>;
    roleList(): Promise<{
        data: {
            roles: Role[];
        };
        message: string;
    }>;
}
