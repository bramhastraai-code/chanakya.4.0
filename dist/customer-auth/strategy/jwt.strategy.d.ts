import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Customer } from 'src/customer/entities/customer.entity';
declare const jwtStrategy_base: new (...args: any[]) => any;
export declare class jwtStrategy extends jwtStrategy_base {
    private customerModel;
    constructor(config: ConfigService, customerModel: Model<Customer>);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<import("mongoose").Document<unknown, {}, Customer, {}, {}> & Customer & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
export {};
