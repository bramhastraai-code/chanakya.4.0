import { UserStatus, UserType, VerificationStatus } from '../enum/usertype.enum';
export declare class CreateBuilderDto {
    name: string;
    userImage?: string;
    fcmToken?: string;
    email: string;
    userType: UserType;
    phoneNumber: string;
    responseTime?: string;
    serviceAreas?: string[];
    builders?: string[];
    verificationStatus: VerificationStatus;
    verificationDocuments?: string[];
    status: UserStatus;
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}
declare const UpdateBuilderDto_base: import("@nestjs/common").Type<Partial<CreateBuilderDto>>;
export declare class UpdateBuilderDto extends UpdateBuilderDto_base {
}
export {};
