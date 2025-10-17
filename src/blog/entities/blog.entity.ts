import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';

@Schema({ timestamps: true }) // Automatically adds `createdAt` and `updatedAt`
/**
 * Represents a blog post entity.
 *
 * @class Blog
 * @extends Document
 *
 * @property {string} id - Unique identifier for the blog post.
 * @property {string} title - Title of the blog post.
 * @property {string} content - Content of the blog post.
 * @property {string} slug - SEO-friendly URL for the blog post.
 * @property {string} [coverImage] - Optional cover image for the blog post.
 * @property {string} category - Category of the blog post.
 * @property {string} [seoTitle] - Optional SEO title for the blog post.
 * @property {string} [seoDescription] - Optional SEO description for the blog post.
 * @property {string[]} [seoKeywords] - Optional SEO keywords for the blog post.
 * @property {number} views - Number of views the blog post has received.
 * @property {number} likes - Number of likes the blog post has received.
 * @property {User} authorId - Reference to the author of the blog post.
 * @property {Types.ObjectId} createdBy - Reference to the user who created the blog post.
 * @property {string} status - Status of the blog post, either 'active' or 'inactive'.
 * @property {Types.ObjectId} updatedBy - Reference to the user who last updated the blog post.
 * @property {Date} createdAt - Timestamp when the blog post was created.
 * @property {Date} updatedAt - Timestamp when the blog post was last updated.
 */
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  slug: string; // SEO-friendly URL

  @Prop()
  coverImage?: string; // Optional cover image for the blog post

  @Prop({ required: false })
  category: string;

  // SEO Fields
  @Prop()
  seoTitle?: string;

  @Prop()
  seoDescription?: string;

  @Prop({ type: [String] })
  seoKeywords?: string[];

  // Metadata
  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  authorId: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  // Timestamp fields
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
