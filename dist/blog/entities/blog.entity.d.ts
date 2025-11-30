import { Document, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
export declare class Blog extends Document {
    title: string;
    content: string;
    description: string;
    slug: string;
    coverImage?: string;
    category: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    views: number;
    likes: number;
    authorId: User;
    createdBy: Types.ObjectId;
    status: string;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BlogSchema: import("mongoose").Schema<Blog, import("mongoose").Model<Blog, any, any, any, Document<unknown, any, Blog, any, {}> & Blog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Blog, Document<unknown, {}, import("mongoose").FlatRecord<Blog>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Blog> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
