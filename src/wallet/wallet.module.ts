import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RazorpayModule } from 'nestjs-razorpay';
import { ConfigModule } from '@nestjs/config';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet, WalletSchema } from './entities/wallet.entity';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { RazorpayService } from './razorpay.service';
import { AgentWalletController } from './controllers/v1/agent-wallet.controller';
import { AdminWalletController } from './controllers/v1/admin-wallet.controller';

@Module({
  imports: [
    ConfigModule,
    RazorpayModule.forRoot({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_2FhwIdAriDpU2J',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'GjfwZCuhU933hSd4Eh1QX5da',
    }),
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [
    WalletController,
    // V1 Controllers
    AgentWalletController,
    AdminWalletController,
  ],
  providers: [WalletService, RazorpayService],
  exports: [WalletService, RazorpayService],
})
export class WalletModule {}
