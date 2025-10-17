import { UserStatus, UserType, VerificationStatus } from '../enum/usertype.enum';
declare class SocialMediaResponseDto {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
}
export declare class BuilderResponseDto {
    id: string;
    name: string;
    userImage?: string;
    fcmToken?: string;
    email: string;
    userType: UserType;
    phoneNumber: string;
    responseTime?: string;
    serviceAreas: string[];
    verificationStatus: VerificationStatus;
    verificationDocuments?: string[];
    licenseNumber?: string;
    licenseExpiry?: Date;
    yearsOfExperience?: number;
    agencyName?: string;
    agencyLicense?: string;
    agencyFoundedYear?: number;
    teamSize: number;
    rating: number;
    reviewCount: number;
    closedDeals: number;
    status: UserStatus;
    socialMedia?: SocialMediaResponseDto;
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
