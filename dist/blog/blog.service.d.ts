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
