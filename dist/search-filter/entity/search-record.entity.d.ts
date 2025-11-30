import { Document } from 'mongoose';
export declare class SearchRecord extends Document {
    term: string;
    popularity: number;
    userId?: string;
}
export declare const SearchRecordSchema: import("mongoose").Schema<SearchRecord, import("mongoose").Model<SearchRecord, any, any, any, Document<unknown, any, SearchRecord, any, {}> & SearchRecord & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SearchRecord, Document<unknown, {}, import("mongoose").FlatRecord<SearchRecord>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SearchRecord> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
