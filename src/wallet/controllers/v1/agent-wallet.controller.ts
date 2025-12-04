import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WalletService } from '../../wallet.service';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TransactionType } from '../../enum/transaction.enum';

@ApiTags('Agent Wallet')
@ApiBearerAuth()
@Controller('agent/wallet')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT, UserRole.BUILDER)
export class AgentWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({
    summary: 'Get wallet balance and stats',
    description:
      'Retrieve current wallet balance, pending earnings, and lifetime earnings for the agent',
  })
  @ApiResponse({
    status: 200,
    description:
      'Wallet details retrieved successfully including balance and earnings',
  })
  async getWallet(@CurrentUser() user: any) {
    const data = await this.walletService.getOrCreateWallet(user.userId);
    return {
      data,
      message: 'Wallet details retrieved successfully',
    };
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Get transaction history',
    description:
      'Retrieve complete transaction history with filtering by type and date range',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 20,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'type',
    enum: TransactionType,
    required: false,
    description: 'Filter by transaction type',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction history retrieved successfully with pagination',
  })
  async getTransactions(@CurrentUser() user: any, @Query() filters: any) {
    const data = await this.walletService.getTransactionsWithFilters(
      user.userId,
      filters,
    );
    return {
      data,
      message: 'Transactions retrieved successfully',
    };
  }
}
