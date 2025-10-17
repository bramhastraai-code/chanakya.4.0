import { CreatePermissionDto } from './permission.dto';
export declare class CreateRoleDto {
    name: string;
    description?: string;
    permissions: CreatePermissionDto[];
}
