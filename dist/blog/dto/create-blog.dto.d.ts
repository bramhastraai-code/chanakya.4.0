export declare class CreateBlogDto {
    title: string;
    content: string;
    description?: string;
    slug: string;
    coverImage?: string;
    category?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    authorId: string;
    createdBy?: string;
    status: string;
    updatedBy?: string;
}
