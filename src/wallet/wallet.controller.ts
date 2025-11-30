import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { AddMoneyDto } from './dto/add-money.dto';
import { WithdrawMoneyDto } from './dto/withdraw-money.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TransactionType } from './enum/transaction.enum';

@ApiTags('Agent')
@ApiBearerAuth()
@Controller('agent/wallet')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.AGENT)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getBalance(@CurrentUser() user: any) {
    const data = await this.walletService.getBalance(user.userId);
    return {
      success: true,
      data,
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: TransactionType })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Transaction history retrieved successfully',
  })
  async getTransactions(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: TransactionType,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const data = await this.walletService.getTransactions(
      user.userId,
      page,
      limit,
      type,
      dateFrom,
      dateTo,
    );
    return {
      success: true,
      data,
    };
  }

  @Post('add-money')
  @ApiOperation({ summary: 'Add money to wallet' })
  @ApiResponse({ status: 201, description: 'Payment initiated successfully' })
  async addMoney(@Body() addMoneyDto: AddMoneyDto, @CurrentUser() user: any) {
    const data = await this.walletService.addMoney(user.userId, addMoneyDto);
    return {
      success: true,
      message: 'Payment initiated',
      data,
    };
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from wallet' })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal request submitted successfully',
  })
  async withdrawMoney(
    @Body() withdrawMoneyDto: WithdrawMoneyDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.walletService.withdrawMoney(
      user.userId,
      withdrawMoneyDto,
    );
    return {
      success: true,
      message: 'Withdrawal request submitted',
      data,
    };
  }
}
