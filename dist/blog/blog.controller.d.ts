import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './entities/blog.entity';
import { Response } from 'src/common/interceptor/response.interface';
import { UpdateBlogDto } from './dto/update-blog.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    create(createBlogDto: CreateBlogDto): Promise<Response<Blog>>;
    findAll(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<Response<{
        blogs: Blog[];
        totalPages: number;
        totalBlogs: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOne(id: string): Promise<Response<Blog>>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<Response<Blog>>;
    remove(id: string): Promise<Response<void>>;
    findActiveBlogs(pageSize: string, pageNumber: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string): Promise<Response<{
        blogs: Blog[];
        totalPages: number;
        totalBlogs: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findOneActive(id: string): Promise<Response<Blog>>;
}
