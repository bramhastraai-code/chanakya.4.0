import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'src/common/interceptor/response.interface';
import { Types } from 'mongoose';
import { Status } from 'src/common/enum/status.enum';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, role?: Types.ObjectId | 'all', status?: Status): Promise<Response<{
        users: User[];
        totalPages: number;
        totalUsers: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<User>>;
    create(createUserDto: CreateUserDto): Promise<Response<User>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Response<User>>;
    remove(id: string): Promise<Response<any>>;
}
