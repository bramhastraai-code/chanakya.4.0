export declare class CreateBuilderDto {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    companyName: string;
    companyLogo?: string;
    establishedYear?: number;
    reraNumber?: string;
    gstin?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    description?: string;
    websiteUrl?: string;
}
