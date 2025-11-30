import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WebsiteV1Service } from '../../services/website-v1.service';
import { CreateWebsiteDto, UpdateWebsiteDto } from '../../dto/v1/website.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Agent Website Builder')
@ApiBearerAuth()
@Controller('agent/website')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT, UserRole.BUILDER)
export class AgentWebsiteController {
  constructor(private readonly websiteService: WebsiteV1Service) {}

  @Get('templates')
  @ApiOperation({ summary: 'List available website templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async getTemplates() {
    const data = await this.websiteService.getTemplates();
    return {
      success: true,
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create/Initialize my website' })
  @ApiResponse({ status: 201, description: 'Website created successfully' })
  async create(@CurrentUser() user: any, @Body() dto: CreateWebsiteDto) {
    const data = await this.websiteService.create(user.userId, dto);
    return {
      success: true,
      message: 'Website initialized successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get my website details' })
  @ApiResponse({ status: 200, description: 'Website retrieved successfully' })
  async getMyWebsite(@CurrentUser() user: any) {
    const data = await this.websiteService.getMyWebsite(user.userId);
    return {
      success: true,
      data,
    };
  }

  @Put()
  @ApiOperation({ summary: 'Update website content/theme' })
  @ApiResponse({ status: 200, description: 'Website updated successfully' })
  async update(@CurrentUser() user: any, @Body() dto: UpdateWebsiteDto) {
    const data = await this.websiteService.update(user.userId, dto);
    return {
      success: true,
      message: 'Website updated successfully',
      data,
    };
  }

  @Post('publish')
  @ApiOperation({ summary: 'Publish website' })
  @ApiResponse({ status: 200, description: 'Website published successfully' })
  async publish(@CurrentUser() user: any) {
    const data = await this.websiteService.publish(user.userId);
    return {
      success: true,
      message: 'Website published successfully',
      data,
    };
  }

  @Get('check-subdomain')
  @ApiOperation({ summary: 'Check subdomain availability' })
  @ApiQuery({ name: 'subdomain', required: true })
  @ApiResponse({
    status: 200,
    description: 'Availability checked successfully',
  })
  async checkSubdomain(@Query('subdomain') subdomain: string) {
    const data = await this.websiteService.checkSubdomain(subdomain);
    return {
      success: true,
      data,
    };
  }
}
