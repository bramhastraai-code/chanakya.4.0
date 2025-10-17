/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
export declare class BlogService {
    private readonly blogModel;
    constructor(blogModel: Model<Blog>);
    create(createBlogDto: CreateBlogDto): Promise<Blog>;
    findAll(pageSize: string, pageNumber: string, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery?: string): Promise<{
        blogs: Blog[];
        totalPages: number;
        totalBlogs: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog>;
    remove(id: string): Promise<void>;
    findActiveBlogs(pageSize: string, pageNumber: string, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery?: string): Promise<{
        blogs: Blog[];
        totalPages: number;
        totalBlogs: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOneActive(id: string): Promise<Blog>;
}
