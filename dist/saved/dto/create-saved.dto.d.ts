import { Types } from 'mongoose';
export declare class CreateSavedDto {
    user: Types.ObjectId;
    project?: Types.ObjectId;
    property?: Types.ObjectId;
    isActive?: boolean;
}
