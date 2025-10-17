export declare class CreatePlanDto {
    title: string;
    price: string;
    billingInfo?: string;
    features: string[] | {
        name: string;
        included: boolean;
    }[];
    color?: string;
    popular?: boolean;
    bgColor?: string;
    logo?: string;
    productType: string;
}
