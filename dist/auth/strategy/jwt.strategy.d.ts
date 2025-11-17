import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
declare const jwtStrategy_base: new (...args: any[]) => any;
export declare class jwtStrategy extends jwtStrategy_base {
    private userModel;
    constructor(config: ConfigService, userModel: Model<User>);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
export {};
