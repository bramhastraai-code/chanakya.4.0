"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const blog_service_1 = require("./blog.service");
const create_blog_dto_1 = require("./dto/create-blog.dto");
const swagger_1 = require("@nestjs/swagger");
const blog_entity_1 = require("./entities/blog.entity");
const update_blog_dto_1 = require("./dto/update-blog.dto");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    async create(createBlogDto) {
        try {
            const data = await this.blogService.create(createBlogDto);
            return { data, message: 'create successfully ' };
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery) {
        try {
            const data = await this.blogService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery);
            if (!data.blogs || data.blogs.length === 0) {
                throw new common_1.NotFoundException('No blog posts found');
            }
            return { data, message: 'strive successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving blog posts.');
        }
    }
    async findOne(id) {
        try {
            const blog = await this.blogService.findOne(id);
            if (!blog) {
                throw new common_1.NotFoundException('Blog post not found');
            }
            return { data: blog, message: 'retrieve successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the blog post.');
        }
    }
    async update(id, updateBlogDto) {
        try {
            const updatedBlog = await this.blogService.update(id, updateBlogDto);
            return { data: updatedBlog, message: 'update successfully' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('An error occurred while updating the blog post.');
        }
    }
    async remove(id) {
        try {
            await this.blogService.remove(id);
            return { data: null, message: 'delete successfully' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('An error occurred while deleting the blog post.');
        }
    }
    async findActiveBlogs(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery) {
        try {
            const data = await this.blogService.findActiveBlogs(pageSize, pageNumber, sortBy, sortOrder, searchQuery);
            console.log(pageSize, pageNumber, sortBy, sortOrder, searchQuery, data);
            if (!data.blogs || data.blogs.length === 0) {
                throw new common_1.NotFoundException('No active blog posts found');
            }
            return { data, message: 'retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async findOneActive(id) {
        try {
            const blog = await this.blogService.findOneActive(id);
            if (!blog) {
                throw new common_1.NotFoundException('Active blog post not found');
            }
            return { data: blog, message: 'retrieve successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the active blog post.');
        }
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog post' }),
    (0, swagger_1.ApiCreatedResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Blog post created successfully',
        type: blog_entity_1.Blog,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_dto_1.CreateBlogDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all blog posts with pagination, sorting, and search',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        type: String,
        required: false,
        enum: ['createdAt', 'updatedAt', 'title'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        type: String,
        required: false,
        enum: ['asc', 'desc'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        type: String,
        required: false,
        description: 'Search term for filtering blog posts by title or content',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of blog posts retrieved successfully',
        type: [blog_entity_1.Blog],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No blog posts found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('blog/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single blog post by ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Blog post retrieved successfully',
        type: blog_entity_1.Blog,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Blog post not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a blog post by ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Blog post updated successfully',
        type: blog_entity_1.Blog,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Blog post not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_dto_1.UpdateBlogDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a blog post by ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Blog post deleted successfully',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Blog post not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all active blog posts with pagination, sorting, and search',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        type: String,
        required: false,
        enum: ['createdAt', 'updatedAt', 'title'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        type: String,
        required: false,
        enum: ['asc', 'desc'],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        type: String,
        required: false,
        description: 'Search term for filtering active blog posts by title or content',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of active blog posts retrieved successfully',
        type: [blog_entity_1.Blog],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No active blog posts found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findActiveBlogs", null);
__decorate([
    (0, common_1.Get)('active/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single active blog post by ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Active blog post retrieved successfully',
        type: blog_entity_1.Blog,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Active blog post not found' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "findOneActive", null);
exports.BlogController = BlogController = __decorate([
    (0, swagger_1.ApiTags)('Blogs'),
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map