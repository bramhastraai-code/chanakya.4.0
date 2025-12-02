import { Model } from 'mongoose';
import { User, UserDocument } from 'src/core/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UnifiedAuthService } from 'src/core/auth/unified-auth.service';
import { Types } from 'mongoose';
import { Status } from 'src/common/enum/status.enum';
export declare class UserService {
    private userModel;
    private authService;
    constructor(userModel: Model<UserDocument>, authService: UnifiedAuthService);
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, role?: Types.ObjectId | 'all', status?: Status): Promise<{
        users: User[];
        totalPages: number;
        totalUsers: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
}
