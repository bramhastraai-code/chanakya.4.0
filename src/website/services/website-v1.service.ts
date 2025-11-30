import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Website } from '../entities/website.entity';
import { WebsiteTemplate } from '../entities/website-template.entity';
import { CreateWebsiteDto, UpdateWebsiteDto } from '../dto/v1/website.dto';
import { WebsiteStatus, TemplateCode } from '../enum/website.enum';

@Injectable()
export class WebsiteV1Service implements OnModuleInit {
  constructor(
    @InjectModel(Website.name) private websiteModel: Model<Website>,
    @InjectModel(WebsiteTemplate.name)
    private templateModel: Model<WebsiteTemplate>,
  ) {}

  /**
   * Seed templates on init
   */
  async onModuleInit() {
    const count = await this.templateModel.countDocuments();
    if (count === 0) {
      await this.templateModel.create([
        {
          name: 'Modern Luxury',
          code: TemplateCode.MODERN_LUXURY,
          previewImage: 'https://example.com/modern.jpg',
          defaultStructure: {
            heroTitle: 'Luxury Living',
            aboutText: 'We sell dreams.',
          },
        },
        {
          name: 'Minimalist Pro',
          code: TemplateCode.MINIMALIST_PRO,
          previewImage: 'https://example.com/minimal.jpg',
          defaultStructure: {
            heroTitle: 'Simple & Elegant',
            aboutText: 'Real estate simplified.',
          },
        },
      ]);
    }
  }

  /**
   * Get all templates
   */
  async getTemplates() {
    return this.templateModel.find().exec();
  }

  /**
   * Create or Initialize website
   */
  async create(userId: Types.ObjectId, dto: CreateWebsiteDto) {
    // Check if user already has a website
    const existing = await this.websiteModel.findOne({ userId });
    if (existing) {
      throw new BadRequestException(
        'You already have a website. Use update instead.',
      );
    }

    // Check subdomain availability
    const subdomainTaken = await this.websiteModel.findOne({
      subdomain: dto.subdomain,
    });
    if (subdomainTaken) {
      throw new BadRequestException('Subdomain is already taken');
    }

    // Get template
    const template = await this.templateModel.findOne({
      code: dto.templateCode,
    });
    if (!template) {
      throw new BadRequestException('Invalid template code');
    }

    return this.websiteModel.create({
      userId,
      subdomain: dto.subdomain,
      template: template._id,
      content: template.defaultStructure,
      status: WebsiteStatus.DRAFT,
    });
  }

  /**
   * Get my website
   */
  async getMyWebsite(userId: Types.ObjectId) {
    const website = await this.websiteModel
      .findOne({ userId })
      .populate('template');

    if (!website) {
      throw new NotFoundException('Website not found');
    }
    return website;
  }

  /**
   * Update website content/theme
   */
  async update(userId: Types.ObjectId, dto: UpdateWebsiteDto) {
    const website = await this.websiteModel.findOne({ userId });
    if (!website) {
      throw new NotFoundException('Website not found');
    }

    if (dto.content) website.content = { ...website.content, ...dto.content };
    if (dto.theme) website.theme = { ...website.theme, ...dto.theme };
    if (dto.customDomain) {
      // Check if custom domain is taken
      const taken = await this.websiteModel.findOne({
        customDomain: dto.customDomain,
        _id: { $ne: website._id },
      });
      if (taken)
        throw new BadRequestException('Custom domain is already taken');
      website.customDomain = dto.customDomain;
    }

    return website.save();
  }

  /**
   * Publish website
   */
  async publish(userId: Types.ObjectId) {
    const website = await this.websiteModel.findOne({ userId });
    if (!website) {
      throw new NotFoundException('Website not found');
    }

    website.status = WebsiteStatus.PUBLISHED;
    website.publishedAt = new Date();
    return website.save();
  }

  /**
   * Check subdomain availability
   */
  async checkSubdomain(subdomain: string) {
    const taken = await this.websiteModel.findOne({ subdomain });
    return { available: !taken };
  }

  /**
   * Public: Get website by subdomain
   */
  async getBySubdomain(subdomain: string) {
    const website = await this.websiteModel
      .findOne({ subdomain, status: WebsiteStatus.PUBLISHED })
      .populate('template')
      .populate('userId', 'name email phoneNumber profileImage'); // Populate agent details

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    return website;
  }
}
