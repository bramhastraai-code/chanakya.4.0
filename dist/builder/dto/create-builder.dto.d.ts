export declare class CreateBuilderDto {
    name: string;
    description: string;
    phone: string;
    email: string;
    alternatePhone?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pinCode?: string;
    logo?: string;
    inquiries?: string[];
    owner?: string;
    createdBy?: string;
    updatedBy?: string;
    views?: number;
    since?: number;
    status: string;
}
