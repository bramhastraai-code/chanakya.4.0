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
import { KycV1Service } from '../../services/kyc-v1.service';
import { ReviewKycDto } from '../../dto/v1/kyc.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Admin KYC')
@ApiBearerAuth()
@Controller('admin/kyc')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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
      success: true,
      data,
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
    @Body() dto: ReviewKycDto,
  ) {
    const data = await this.kycService.reviewSubmission(
      id,
      user.userId,
      dto.approved,
      dto.rejectionReason,
    );
    return {
      success: true,
      message: dto.approved ? 'KYC approved' : 'KYC rejected',
      data,
    };
  }
}
