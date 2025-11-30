import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { KycV1Service } from '../../services/kyc-v1.service';
import { SubmitKycDto } from '../../dto/v1/kyc.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Agent KYC')
@ApiBearerAuth()
@Controller('agent/kyc')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT, UserRole.BUILDER)
export class AgentKycController {
  constructor(private readonly kycService: KycV1Service) {}

  @Get('status')
  @ApiOperation({ summary: 'Get my KYC status' })
  @ApiResponse({
    status: 200,
    description: 'KYC status retrieved successfully',
  })
  async getStatus(@CurrentUser() user: any) {
    const data = await this.kycService.getStatus(user.userId);
    return {
      success: true,
      data,
    };
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit KYC documents' })
  @ApiResponse({ status: 201, description: 'KYC submitted successfully' })
  async submit(@CurrentUser() user: any, @Body() dto: SubmitKycDto) {
    const data = await this.kycService.submitKyc(user.userId, dto);
    return {
      success: true,
      message:
        'KYC documents submitted successfully. Admin will review them shortly.',
      data,
    };
  }
}
