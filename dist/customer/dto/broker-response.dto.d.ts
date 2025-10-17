import { VerificationStatus } from '../enum/usertype.enum';
export declare class BrokerResponseDto {
    _id?: string;
    name?: string;
    userImage?: string;
    email?: string;
    responseTime?: string;
    serviceAreas?: string[];
    verificationStatus?: VerificationStatus;
    verificationDocuments?: string[];
    licenseNumber?: string;
    licenseExpiry?: Date;
    yearsOfExperience?: number;
    agencyName?: string;
    agencyLicense?: string;
    agencyFoundedYear?: number;
    teamSize?: number;
    rating?: number;
    reviewCount?: number;
    closedDeals?: number;
    performanceScore?: number;
}
