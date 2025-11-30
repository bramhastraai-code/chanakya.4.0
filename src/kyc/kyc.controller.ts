import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
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
import { KycService } from './kyc.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

// Agent KYC Controller
@ApiTags('Agent')
@ApiBearerAuth()
@Controller('api/agent/kyc')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class AgentKycController {
  constructor(private readonly kycService: KycService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  async getStatus(@CurrentUser() user: any) {
    const data = await this.kycService.getStatus(user.userId);
    return {
      success: true,
      data,
    };
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit KYC documents' })
  @ApiResponse({ status: 201, description: 'KYC documents submitted successfully' })
  async submit(@Body() submitKycDto: SubmitKycDto, @CurrentUser() user: any) {
    const data = await this.kycService.submit(user.userId, submitKycDto);
    return {
      success: true,
      message: 'KYC documents submitted successfully',
      data,
    };
  }
}

// Admin KYC Controller
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('api/admin/kyc')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminKycController {
  constructor(private readonly kycService: KycService) {}

  @Get('submissions')
  @ApiOperation({ summary: 'Get pending KYC submissions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'KYC submissions retrieved successfully' })
  async getPendingSubmissions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const data = await this.kycService.getPendingSubmissions(page, limit);
    return {
      success: true,
      data,
    };
  }

  @Put('submissions/:id/approve')
  @ApiOperation({ summary: 'Approve KYC submission' })
  @ApiResponse({ status: 200, description: 'KYC approved successfully' })
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    const data = await this.kycService.approve(id, user.userId);
    return {
      success: true,
      message: 'KYC approved successfully',
      data,
    };
  }

  @Put('submissions/:id/reject')
  @ApiOperation({ summary: 'Reject KYC submission' })
  @ApiResponse({ status: 200, description: 'KYC rejected successfully' })
  async reject(
    @Param('id') id: string,
    @Body() reviewKycDto: ReviewKycDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.kycService.reject(
      id,
      user.userId,
      reviewKycDto.rejectionReason || 'No reason provided',
    );
    return {
      success: true,
      message: 'KYC rejected successfully',
      data,
    };
  }
}
