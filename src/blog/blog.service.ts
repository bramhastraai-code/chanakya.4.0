import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    try {
      const newBlog = new this.blogModel(createBlogDto);
      return newBlog.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery?: string,
  ): Promise<{
    blogs: Blog[];
    totalPages: number;
    totalBlogs: number;
    pageSize: number;
    pageNumber: number;
  }> {
    const limit = parseInt(pageSize);
    const skip = (parseInt(pageNumber) - 1) * limit;

    const query: any = {};
    if (searchQuery) {
      query.$or = [
        { title: new RegExp(searchQuery, 'i') },
        { content: new RegExp(searchQuery, 'i') },
      ];
    }

    const blogs = await this.blogModel
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalBlogs = await this.blogModel.countDocuments(query).exec();
    const totalPages = Math.ceil(totalBlogs / limit);

    return {
      blogs,
      totalPages,
      totalBlogs,
      pageSize: limit,
      pageNumber: parseInt(pageNumber),
    };
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto)
      .exec();
    if (!updatedBlog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return updatedBlog;
  }

  async remove(id: string): Promise<void> {
    const result = await this.blogModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
  }
  //web----------------------//web----------------------//web----------------------
  async findActiveBlogs(
    pageSize: string,
    pageNumber: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery?: string,
  ): Promise<{
    blogs: Blog[];
    totalPages: number;
    totalBlogs: number;
    pageSize: number;
    pageNumber: number;
  }> {
    const limit = parseInt(pageSize);
    const skip = (parseInt(pageNumber) - 1) * limit;

    const query: any = { status: 'active' };
    if (searchQuery) {
      query.$or = [
        { title: new RegExp(searchQuery, 'i') },
        { content: new RegExp(searchQuery, 'i') },
      ];
    }

    const blogs = await this.blogModel
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalBlogs = await this.blogModel.countDocuments(query).exec();
    const totalPages = Math.ceil(totalBlogs / limit);

    return {
      blogs,
      totalPages,
      totalBlogs,
      pageSize: limit,
      pageNumber: parseInt(pageNumber),
    };
  }
  async findOneActive(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findOne({ _id: id, status: 'active' })
      .exec();
    if (!blog) {
      throw new NotFoundException(`Active blog with ID ${id} not found`);
    }
    return blog;
  }
}
