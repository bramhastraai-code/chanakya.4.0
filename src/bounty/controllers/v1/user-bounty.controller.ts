import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BountyV1Service } from '../../services/bounty-v1.service';
import { SubmitBountyDto } from '../../dto/v1/bounty.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Bounty agent  Program')
@ApiBearerAuth()
@Controller('bounties/agent')
@UseGuards(jwtGuard)
export class UserBountyController {
  constructor(private readonly bountyService: BountyV1Service) {}

  @Get()
  @ApiOperation({ summary: 'List active bounty programs' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Active bounties retrieved successfully',
  })
  async getActiveBounties(@Query('projectId') projectId?: string) {
    const data = await this.bountyService.findAllActive(projectId);
    return {
      success: true,
      data,
    };
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit a claim/referral for a bounty' })
  @ApiResponse({ status: 201, description: 'Submission received successfully' })
  async submit(@CurrentUser() user: any, @Body() dto: SubmitBountyDto) {
    const data = await this.bountyService.submit(user.userId, dto);
    return {
      success: true,
      message: 'Submission received. You will be notified once reviewed.',
      data,
    };
  }

  @Get('my-submissions')
  @ApiOperation({ summary: 'Get my submissions' })
  @ApiResponse({
    status: 200,
    description: 'Submissions retrieved successfully',
  })
  async getMySubmissions(@CurrentUser() user: any) {
    const data = await this.bountyService.getMySubmissions(user.userId);
    return {
      success: true,
      data,
    };
  }
}
