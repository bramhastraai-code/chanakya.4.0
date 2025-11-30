import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WalletV1Service } from '../../services/wallet-v1.service';
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
  constructor(private readonly walletService: WalletV1Service) {}

  @Get()
  @ApiOperation({ summary: 'Get wallet balance and stats' })
  @ApiResponse({
    status: 200,
    description: 'Wallet details retrieved successfully',
  })
  async getWallet(@CurrentUser() user: any) {
    const data = await this.walletService.getWallet(user.userId);
    return {
      success: true,
      data,
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'type', enum: TransactionType, required: false })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  async getTransactions(@CurrentUser() user: any, @Query() filters: any) {
    const data = await this.walletService.getTransactions(user.userId, filters);
    return {
      success: true,
      data,
    };
  }
}
