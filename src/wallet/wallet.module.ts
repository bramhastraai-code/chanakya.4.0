import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet, WalletSchema } from './entities/wallet.entity';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { WalletV1Service } from './services/wallet-v1.service';
import { AgentWalletController } from './controllers/v1/agent-wallet.controller';
import { AdminWalletController } from './controllers/v1/admin-wallet.controller';

@Module({
  imports: [
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
  providers: [
    WalletService,
    // V1 Service
    WalletV1Service,
  ],
  exports: [WalletService, WalletV1Service],
})
export class WalletModule {}
