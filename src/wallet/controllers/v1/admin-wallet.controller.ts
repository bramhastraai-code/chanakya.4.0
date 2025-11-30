import {
  Controller,
  Get,
  Post,
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
  ApiBody,
} from '@nestjs/swagger';
import { WalletV1Service } from '../../services/wallet-v1.service';
import { CreditDebitDto } from '../../dto/v1/wallet.dto';
import { jwtGuard } from 'src/core/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Types } from 'mongoose';

@ApiTags('Admin Wallet')
@ApiBearerAuth()
@Controller('admin/wallet')
@UseGuards(jwtGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminWalletController {
  constructor(private readonly walletService: WalletV1Service) {}

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user wallet details' })
  @ApiResponse({
    status: 200,
    description: 'User wallet retrieved successfully',
  })
  async getUserWallet(@Param('userId') userId: string) {
    const data = await this.walletService.getWallet(new Types.ObjectId(userId));
    return {
      success: true,
      data,
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
      success: true,
      message: 'Wallet adjusted successfully',
      data,
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
    const data = await this.walletService.getTransactions(
      new Types.ObjectId(userId),
      filters,
    );
    return {
      success: true,
      data,
    };
  }
}
