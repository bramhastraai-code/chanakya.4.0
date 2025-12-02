import {
  Controller,
  Get,
  Post,
  Param,
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
  ApiBody,
} from '@nestjs/swagger';
import { PropertyApprovalService } from '../../services/property-approval.service';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Admin Properties')
@ApiBearerAuth()
@Controller('admin/properties')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPropertiesController {
  constructor(private readonly approvalService: PropertyApprovalService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending properties for approval' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Pending properties retrieved' })
  async getPending(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const data = await this.approvalService.getPending(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
    return {
      success: true,
      data,
    };
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve property' })
  @ApiResponse({ status: 200, description: 'Property approved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async approve(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.approvalService.approve(id, user.userId);
    return {
      success: true,
      message: 'Property approved successfully',
      data,
    };
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject property' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', example: 'Incomplete information' },
      },
      required: ['reason'],
    },
  })
  @ApiResponse({ status: 200, description: 'Property rejected successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async reject(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    const data = await this.approvalService.reject(id, user.userId, reason);
    return {
      success: true,
      message: 'Property rejected successfully',
      data,
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get approval statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    const data = await this.approvalService.getStats();
    return {
      success: true,
      data,
    };
  }
}
