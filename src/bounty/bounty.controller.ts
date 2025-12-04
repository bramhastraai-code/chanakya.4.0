import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BountyService } from './bounty.service';
import {
  CreateBountyDto,
  ReviewSubmissionDto,
  SubmitBountyDto,
  UpdateBountyDto,
} from './dto/bounty.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { SubmissionStatus } from './enum/bounty.enum';

@ApiTags('Bounty Management')
@ApiBearerAuth()
@Controller('bounties')
@UseGuards(jwtGuard)
export class BountyController {
  constructor(private readonly bountyService: BountyService) {}

  // --- Admin/Builder Endpoints ---

  @Post('manage')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUILDER)
  @ApiOperation({ summary: 'Create a new bounty program' })
  @ApiResponse({ status: 201, description: 'Bounty created successfully' })
  async create(@CurrentUser() user: any, @Body() dto: CreateBountyDto) {
    const data = await this.bountyService.create(user, dto);
    return {
      data,
      message: 'Bounty program created successfully',
    };
  }

  @Get('manage')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUILDER)
  @ApiOperation({ summary: 'Get all bounties with filters' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'builderId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Bounties retrieved successfully' })
  async getAllBounties(@Query() filters: any) {
    const data = await this.bountyService.findAll(filters);
    return {
      data,
      message: 'Bounties retrieved successfully',
    };
  }

  @Get('manage/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUILDER)
  @ApiOperation({ summary: 'Get a single bounty by ID' })
  @ApiParam({ name: 'id', description: 'Bounty ID' })
  @ApiResponse({ status: 200, description: 'Bounty retrieved successfully' })
  async getOne(@Param('id') id: string) {
    const data = await this.bountyService.findOne(id);
    return {
      data,
      message: 'Bounty retrieved successfully',
    };
  }

  @Patch('manage/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUILDER)
  @ApiOperation({ summary: 'Update a bounty program' })
  @ApiParam({ name: 'id', description: 'Bounty ID' })
  @ApiResponse({ status: 200, description: 'Bounty updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBountyDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.bountyService.update(id, dto, user);
    return {
      data,
      message: 'Bounty updated successfully',
    };
  }

  @Delete('manage/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUILDER)
  @ApiOperation({ summary: 'Delete a bounty program' })
  @ApiParam({ name: 'id', description: 'Bounty ID' })
  @ApiResponse({ status: 200, description: 'Bounty deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.bountyService.remove(id, user);
    return {
      data: null,
      message: 'Bounty deleted successfully',
    };
  }

  @Get('manage/submissions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUILDER)
  @ApiOperation({ summary: 'Get all submissions' })
  @ApiQuery({ name: 'status', enum: SubmissionStatus, required: false })
  @ApiQuery({ name: 'bountyId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Submissions retrieved successfully',
  })
  async getSubmissions(@Query() filters: any) {
    const data = await this.bountyService.getAllSubmissions(filters);
    return {
      data,
      message: 'Submissions retrieved successfully',
    };
  }

  @Put('manage/submissions/:id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUILDER)
  @ApiOperation({ summary: 'Review submission (Approve/Reject)' })
  @ApiResponse({ status: 200, description: 'Submission reviewed successfully' })
  async review(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: ReviewSubmissionDto,
  ) {
    const data = await this.bountyService.reviewSubmission(
      id,
      user.userId,
      dto.approved,
      dto.feedback,
    );
    return {
      data,
      message: dto.approved
        ? 'Submission approved and reward credited'
        : 'Submission rejected',
    };
  }

  // --- User/Agent Endpoints ---

  @Get('agent')
  @ApiOperation({ summary: 'List active bounty programs' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Active bounties retrieved successfully',
  })
  async getActiveBounties(@Query('projectId') projectId?: string) {
    const data = await this.bountyService.findAllActive(projectId);
    return {
      data,
      message: 'Active bounties retrieved successfully',
    };
  }

  @Post('agent/submit')
  @ApiOperation({ summary: 'Submit a claim/referral for a bounty' })
  @ApiResponse({ status: 201, description: 'Submission received successfully' })
  async submit(@CurrentUser() user: any, @Body() dto: SubmitBountyDto) {
    const data = await this.bountyService.submit(user.userId, dto);
    return {
      data,
      message: 'Submission received. You will be notified once reviewed.',
    };
  }

  @Get('agent/my-submissions')
  @ApiOperation({ summary: 'Get my submissions' })
  @ApiResponse({
    status: 200,
    description: 'Submissions retrieved successfully',
  })
  async getMySubmissions(@CurrentUser() user: any) {
    const data = await this.bountyService.getMySubmissions(user.userId);
    return {
      data,
      message: 'Submissions retrieved successfully',
    };
  }
}
