import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { WalletService } from '../../wallet.service';
import { CreditDebitDto } from '../../dto/wallet.dto';
import { AdminDepositDto } from '../../dto/admin-deposit.dto';
import {
  AdminWithdrawalApprovalDto,
  WithdrawalStatus,
} from '../../dto/admin-withdrawal.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Admin Wallet Management')
@ApiBearerAuth()
@Controller('admin/wallet')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user wallet details' })
  @ApiResponse({
    status: 200,
    description: 'User wallet retrieved successfully',
  })
  async getUserWallet(@Param('userId') userId: string) {
    const data = await this.walletService.getOrCreateWallet(userId);
    return {
      data,
      message: 'User wallet retrieved successfully',
    };
  }

  @Post('users/:userId/adjust')
  @ApiOperation({ summary: 'Manually credit/debit user wallet' })
  @ApiBody({ type: CreditDebitDto })
  @ApiResponse({ status: 200, description: 'Wallet adjusted successfully' })
  async adjustWallet(
    @CurrentUser() admin: any,
    @Param('userId') userId: string,
    @Body() dto: CreditDebitDto,
  ) {
    const data = await this.walletService.manualAdjustment(
      userId,
      dto.amount,
      dto.type,
      dto.description,
      admin.userId,
    );
    return {
      data,
      message: 'Wallet adjusted successfully',
    };
  }

  @Get('transactions/users/:userId')
  @ApiOperation({ summary: 'Get user transaction history' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  async getUserTransactions(
    @Param('userId') userId: string,
    @Query() filters: any,
  ) {
    const data = await this.walletService.getTransactionsWithFilters(
      userId,
      filters,
    );
    return {
      data,
      message: 'Transactions retrieved successfully',
    };
  }

  // === New Endpoints for Deposit & Withdrawal Management ===

  @Post('users/:userId/deposit')
  @ApiOperation({
    summary: 'Admin deposits money to user wallet',
    description:
      'Admin can credit money to user wallet for commissions, rewards, refunds, etc.',
  })
  @ApiParam({ name: 'userId', description: 'User ID to deposit money to' })
  @ApiBody({ type: AdminDepositDto })
  @ApiResponse({
    status: 201,
    description: 'Money deposited successfully',
  })
  async depositMoney(
    @CurrentUser() admin: any,
    @Param('userId') userId: string,
    @Body() depositDto: AdminDepositDto,
  ) {
    const data = await this.walletService.adminDeposit(
      userId,
      depositDto.amount,
      depositDto.description,
      admin.userId,
      depositDto.propertyId,
      depositDto.bountyId,
    );
    return {
      data,
      message: 'Money deposited to wallet successfully',
    };
  }

  @Get('withdrawals/pending')
  @ApiOperation({
    summary: 'Get all pending withdrawal requests',
    description: 'View all user withdrawal requests pending admin approval',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Pending withdrawals retrieved successfully',
  })
  async getPendingWithdrawals(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const data = await this.walletService.getPendingWithdrawals(page, limit);
    return {
      data,
      message: 'Pending withdrawals retrieved successfully',
    };
  }

  @Get('withdrawals')
  @ApiOperation({
    summary: 'Get all withdrawal requests with filters',
    description: 'View all withdrawal requests with status filters',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: WithdrawalStatus,
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Withdrawals retrieved successfully',
  })
  async getAllWithdrawals(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: WithdrawalStatus,
    @Query('userId') userId?: string,
  ) {
    const data = await this.walletService.getWithdrawals({
      page,
      limit,
      status,
      userId,
    });
    return {
      data,
      message: 'Withdrawals retrieved successfully',
    };
  }

  @Patch('withdrawals/:transactionId/approve')
  @ApiOperation({
    summary: 'Approve withdrawal request',
    description:
      'Admin approves withdrawal and initiates Razorpay payout to user bank account',
  })
  @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
  @ApiBody({ type: AdminWithdrawalApprovalDto })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal approved and payout initiated',
  })
  async approveWithdrawal(
    @CurrentUser() admin: any,
    @Param('transactionId') transactionId: string,
    @Body() approvalDto: AdminWithdrawalApprovalDto,
  ) {
    const data = await this.walletService.approveWithdrawal(
      transactionId,
      admin.userId,
      approvalDto.remarks,
      approvalDto.payoutId,
    );
    return {
      data,
      message: 'Withdrawal approved and payout initiated',
    };
  }

  @Patch('withdrawals/:transactionId/reject')
  @ApiOperation({
    summary: 'Reject withdrawal request',
    description:
      'Admin rejects withdrawal request and refunds amount to user wallet',
  })
  @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        remarks: { type: 'string', example: 'Invalid bank details' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal rejected and amount refunded',
  })
  async rejectWithdrawal(
    @CurrentUser() admin: any,
    @Param('transactionId') transactionId: string,
    @Body('remarks') remarks?: string,
  ) {
    const data = await this.walletService.rejectWithdrawal(
      transactionId,
      admin.userId,
      remarks,
    );
    return {
      data,
      message: 'Withdrawal rejected and amount refunded to wallet',
    };
  }

  @Post('withdrawals/:transactionId/complete')
  @ApiOperation({
    summary: 'Mark withdrawal as completed',
    description:
      'Admin marks withdrawal as completed after successful bank transfer',
  })
  @ApiParam({ name: 'transactionId', description: 'Transaction ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        payoutId: { type: 'string', example: 'razorpay_payout_123' },
        remarks: { type: 'string', example: 'Transfer completed successfully' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal marked as completed',
  })
  async completeWithdrawal(
    @CurrentUser() admin: any,
    @Param('transactionId') transactionId: string,
    @Body('payoutId') payoutId?: string,
    @Body('remarks') remarks?: string,
  ) {
    const data = await this.walletService.completeWithdrawal(
      transactionId,
      admin.userId,
      payoutId,
      remarks,
    );
    return {
      data,
      message: 'Withdrawal completed successfully',
    };
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get wallet statistics',
    description: 'View overall wallet statistics across all users',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics() {
    const data = await this.walletService.getWalletStatistics();
    return {
      data,
      message: 'Statistics retrieved successfully',
    };
  }
}
