import { Status } from 'src/common/enum/status.enum';
export declare class CreateUserDto {
    userImage?: any;
    password: string;
    email: string;
    name?: string;
    contactNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    role?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    status?: Status;
}
