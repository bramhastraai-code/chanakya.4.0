import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BountyV1Service } from '../../services/bounty-v1.service';
import { SubmitBountyDto } from '../../dto/v1/bounty.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Bounty Program')
@ApiBearerAuth()
@Controller('bounties')
@UseGuards(jwtGuard)
export class UserBountyController {
  constructor(private readonly bountyService: BountyV1Service) {}

  @Get()
  @ApiOperation({ summary: 'List active bounty programs' })
  @ApiResponse({
    status: 200,
    description: 'Active bounties retrieved successfully',
  })
  async getActiveBounties() {
    const data = await this.bountyService.findAllActive();
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
