export declare class CreateInquiryDto {
    email?: string;
    name?: string;
    phone?: string;
    companyname?: string;
    title?: string;
    inquiryType?: 'common' | 'groupBuy' | 'agentSelection' | 'quickBuy' | 'siteVisit' | 'loan' | 'advisory';
    projectId?: string;
    propertyId?: string;
    message: string;
    about: string;
    siteVisitDate?: Date;
    siteVisitTime?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
