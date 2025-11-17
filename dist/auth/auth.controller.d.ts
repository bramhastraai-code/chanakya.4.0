import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response as CustomResponse } from 'src/common/interceptor/response.interface';
import { Types } from 'mongoose';
import { Response } from 'express';
import { User } from 'src/user/entity/user.entity';
import { AdminResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(dto: UpdateAuthDto, res: Response): Promise<CustomResponse<{
        email: string;
        _id: Types.ObjectId;
    }>>;
    refreshToken(dto: RefreshTokenDto, res: Response): Promise<CustomResponse<{
        accessToken: string;
        refreshToken: string;
    }>>;
    resetPassword(dto: AdminResetPasswordDto): Promise<CustomResponse<User>>;
}
