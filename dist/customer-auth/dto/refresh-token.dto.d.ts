import { Types } from 'mongoose';
export declare class RefreshTokenDto {
    userId: Types.ObjectId;
    refreshToken: string;
}
