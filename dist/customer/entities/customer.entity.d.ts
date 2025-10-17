/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
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
export declare const CustomerSchema: mongoose.Schema<Customer, mongoose.Model<Customer, any, any, any, mongoose.Document<unknown, any, Customer> & Customer & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Customer, mongoose.Document<unknown, {}, mongoose.FlatRecord<Customer>> & mongoose.FlatRecord<Customer> & {
    _id: mongoose.Types.ObjectId;
}>;
