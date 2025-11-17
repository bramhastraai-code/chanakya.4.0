import mongoose, { Document } from 'mongoose';
import { LeadStatus, UserStatus, UserType } from '../enum/usertype.enum';
export declare class Customer extends Document {
    name?: string;
    userImage: string;
    fcmToken?: string;
    email?: string;
    userType: UserType;
    phoneNumber: string;
    assignAgent: mongoose.Types.ObjectId | Customer | string;
    projectsApplied: string[];
    contactStatus?: string;
    responseTime?: string;
    serviceAreas: string[];
    verificationStatus: string;
    verificationDocuments?: string[];
    licenseNumber?: string;
    licenseExpiry?: Date;
    yearsOfExperience?: number;
    agencyName?: string;
    agencyLicense?: string;
    agencyFoundedYear?: number;
    teamSize?: number;
    rating: number;
    reviewCount: number;
    closedDeals: number;
    status: UserStatus;
    refreshToken: string;
    socialMedia?: {
        facebook?: string;
        linkedin?: string;
        instagram?: string;
    };
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    builders: mongoose.Types.ObjectId[] | string[];
    createdAt: Date;
    updatedAt: Date;
    statusHistory: Array<{
        previousStatus: LeadStatus;
        newStatus: LeadStatus;
        changedBy: string;
        changedAt: Date;
        notes?: string;
    }>;
}
export declare const CustomerSchema: mongoose.Schema<Customer, mongoose.Model<Customer, any, any, any, mongoose.Document<unknown, any, Customer, any, {}> & Customer & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Customer, mongoose.Document<unknown, {}, mongoose.FlatRecord<Customer>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Customer> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
