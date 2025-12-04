import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
import { KycV1Service } from './kyc.service';
import { SubmitKycDto, ReviewKycDto, UpdateKycDto } from './dto/kyc.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

// Agent KYC Controller
@ApiTags('Agent')
@ApiBearerAuth()
@Controller('agent/kyc')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT, UserRole.BUILDER)
export class AgentKycController {
  constructor(private readonly kycService: KycV1Service) {}

  @Get('status')
  @ApiOperation({ summary: 'Get KYC status' })
  @ApiResponse({
    status: 200,
    description: 'KYC status retrieved successfully',
  })
  async getStatus(@CurrentUser() user: any) {
    const data = await this.kycService.getStatus(user.userId);
    return {
      data,
      message: 'KYC status retrieved successfully',
    };
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit KYC documents' })
  @ApiResponse({
    status: 201,
    description: 'KYC documents submitted successfully',
  })
  async submit(@Body() submitKycDto: SubmitKycDto, @CurrentUser() user: any) {
    const data = await this.kycService.submitKyc(user.userId, submitKycDto);
    return {
      data,
      message:
        'KYC documents submitted successfully. Admin will review them shortly.',
    };
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update KYC documents' })
  @ApiResponse({
    status: 200,
    description: 'KYC documents updated successfully',
  })
  async update(@Body() updateKycDto: UpdateKycDto, @CurrentUser() user: any) {
    const data = await this.kycService.updateKyc(user.userId, updateKycDto);
    return {
      data,
      message: 'KYC updated successfully.',
    };
  }
}

// Admin KYC Controller
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/kyc')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminKycController {
  constructor(private readonly kycService: KycV1Service) {}

  @Get('submissions')
  @ApiOperation({ summary: 'Get pending KYC submissions' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Submissions retrieved successfully',
  })
  async getSubmissions(@Query() filters: any) {
    const data = await this.kycService.getPendingSubmissions(filters);
    return {
      data,
      message: 'Submissions retrieved successfully',
    };
  }

  @Get('submissions/:id')
  @ApiOperation({ summary: 'Get submission details' })
  @ApiResponse({
    status: 200,
    description: 'Submission details retrieved successfully',
  })
  async getSubmission(@Param('id') id: string) {
    const data = await this.kycService.getSubmission(id);
    return {
      data,
      message: 'Submission details retrieved successfully',
    };
  }

  @Put('submissions/:id/review')
  @ApiOperation({ summary: 'Review submission (Approve/Reject)' })
  @ApiResponse({ status: 200, description: 'Submission reviewed successfully' })
  async review(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: ReviewKycDto,
  ) {
    const data = await this.kycService.reviewSubmission(
      id,
      user.userId,
      dto.approved,
      dto.rejectionReason,
    );
    return {
      data,
      message: dto.approved ? 'KYC approved' : 'KYC rejected',
    };
  }
}
