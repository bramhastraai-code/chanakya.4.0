import { Document } from 'mongoose';
export type PlanDocument = Plan & Document;
export declare class Plan {
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
    status: string;
    createdBy: string;
    updatedBy?: string;
}
export declare const PlanSchema: import("mongoose").Schema<Plan, import("mongoose").Model<Plan, any, any, any, Document<unknown, any, Plan, any, {}> & Plan & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Plan, Document<unknown, {}, import("mongoose").FlatRecord<Plan>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Plan> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
