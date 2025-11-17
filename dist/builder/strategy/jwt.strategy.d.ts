import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Builder } from '../entities/builder.entity';
declare const adminJwtStrategy_base: new (...args: any[]) => any;
export declare class adminJwtStrategy extends adminJwtStrategy_base {
    private builderModel;
    constructor(config: ConfigService, builderModel: Model<Builder>);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<import("mongoose").Document<unknown, {}, Builder, {}, {}> & Builder & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
export {};
