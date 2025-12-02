import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { PurchaseSubscriptionDto } from './dto/purchase-subscription.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Agent')
@ApiBearerAuth()
@Controller('agent/subscriptions')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async getPlans() {
    const data = await this.subscriptionService.getAllPlans();

    return {
      success: true,
      data,
    };
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current active subscription' })
  @ApiResponse({ status: 200, description: 'Current subscription retrieved' })
  async getCurrentSubscription(@CurrentUser() user: any) {
    const data = await this.subscriptionService.getCurrentSubscription(
      user.userId,
    );

    return {
      success: true,
      data,
    };
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Purchase subscription plan' })
  @ApiResponse({
    status: 201,
    description: 'Subscription purchased successfully',
  })
  async purchaseSubscription(
    @Body() purchaseDto: PurchaseSubscriptionDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.subscriptionService.purchaseSubscription(
      user.userId,
      purchaseDto,
    );

    return {
      success: true,
      message: 'Subscription purchased successfully',
      data,
    };
  }

  @Get('commission-tracking')
  @ApiOperation({ summary: 'Get commission tracking details' })
  @ApiResponse({ status: 200, description: 'Commission tracking retrieved' })
  async getCommissionTracking(@CurrentUser() user: any) {
    const data = await this.subscriptionService.getCommissionTracking(
      user.userId,
    );

    return {
      success: true,
      data,
    };
  }

  @Get('benefits')
  @ApiOperation({ summary: 'Get subscription benefits' })
  @ApiResponse({ status: 200, description: 'Benefits retrieved successfully' })
  async getBenefits(@CurrentUser() user: any) {
    const data = await this.subscriptionService.getSubscriptionBenefits(
      user.userId,
    );

    return {
      success: true,
      data,
    };
  }

  @Delete('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled successfully',
  })
  async cancelSubscription(@CurrentUser() user: any) {
    const data = await this.subscriptionService.cancelSubscription(user.userId);

    return {
      success: true,
      message: 'Subscription cancelled successfully',
      data,
    };
  }
}

// Admin controller for managing subscription plans
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/subscriptions')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminSubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('seed-plans')
  @ApiOperation({ summary: 'Seed default subscription plans' })
  @ApiResponse({ status: 201, description: 'Plans seeded successfully' })
  async seedPlans() {
    const data = await this.subscriptionService.seedPlans();

    return {
      success: true,
      message: data.message,
    };
  }
}
