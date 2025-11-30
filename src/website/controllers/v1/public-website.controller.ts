import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebsiteV1Service } from '../../services/website-v1.service';

@ApiTags('Public Website Access')
@Controller('public/website')
export class PublicWebsiteController {
  constructor(private readonly websiteService: WebsiteV1Service) {}

  @Get(':subdomain')
  @ApiOperation({ summary: 'Get website data by subdomain' })
  @ApiResponse({
    status: 200,
    description: 'Website data retrieved successfully',
  })
  async getBySubdomain(@Param('subdomain') subdomain: string) {
    const data = await this.websiteService.getBySubdomain(subdomain);
    return {
      success: true,
      data,
    };
  }
}
