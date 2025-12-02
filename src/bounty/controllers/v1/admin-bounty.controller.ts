import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BountyV1Service } from '../../services/bounty-v1.service';
import { CreateBountyDto, ReviewSubmissionDto } from '../../dto/v1/bounty.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { SubmissionStatus } from '../../enum/bounty.enum';

@ApiTags('Admin Bounty Management')
@ApiBearerAuth()
@Controller('admin/bounties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminBountyController {
  constructor(private readonly bountyService: BountyV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bounty program' })
  @ApiResponse({ status: 201, description: 'Bounty created successfully' })
  async create(@CurrentUser() user: any, @Body() dto: CreateBountyDto) {
    const data = await this.bountyService.create(user.userId, dto);
    return {
      success: true,
      message: 'Bounty program created successfully',
      data,
    };
  }

  @Get('submissions')
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
      success: true,
      data,
    };
  }

  @Put('submissions/:id/review')
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
      success: true,
      message: dto.approved
        ? 'Submission approved and reward credited'
        : 'Submission rejected',
      data,
    };
  }
}
