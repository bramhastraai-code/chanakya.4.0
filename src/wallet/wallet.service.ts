import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from './entities/wallet.entity';
import { Transaction, TransactionDocument } from './entities/transaction.entity';
import { TransactionType, TransactionStatus } from './enum/transaction.enum';
import { AddMoneyDto } from './dto/add-money.dto';
import { WithdrawMoneyDto } from './dto/withdraw-money.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async getOrCreateWallet(userId: string): Promise<WalletDocument> {
    let wallet = await this.walletModel.findOne({ user: userId });

    if (!wallet) {
      wallet = new this.walletModel({
        user: userId,
        balance: 0,
        pendingEarnings: 0,
        lifetimeEarnings: 0,
      });
      await wallet.save();
    }

    return wallet;
  }

  async getBalance(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);

    return {
      balance: wallet.balance,
      currency: 'INR',
      pendingEarnings: wallet.pendingEarnings,
      lifetimeEarnings: wallet.lifetimeEarnings,
    };
  }

  async getTransactions(
    userId: string,
    page: number = 1,
    limit: number = 20,
    type?: TransactionType,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const query: any = { user: userId };

    if (type) {
      query.type = type;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(query)
        .populate('property', 'propertyTitle')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(query),
    ]);

    // Calculate summary
    const summary = await this.getTransactionSummary(userId);

    return {
      transactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      summary,
    };
  }

  async addMoney(userId: string, addMoneyDto: AddMoneyDto) {
    const wallet = await this.getOrCreateWallet(userId);

    // Generate order ID for payment gateway
    const orderId = `order_${Date.now()}_${userId.slice(-6)}`;
    const paymentId = `pay_${Date.now()}`;

    // Create pending transaction
    const transaction = new this.transactionModel({
      user: userId,
      type: TransactionType.CREDIT,
      amount: addMoneyDto.amount,
      description: 'Wallet top-up',
      status: TransactionStatus.PENDING,
      balanceAfter: wallet.balance,
      orderId,
      paymentId,
      metadata: {
        paymentMethod: addMoneyDto.paymentMethod,
        upiId: addMoneyDto.upiId,
      },
    });

    await transaction.save();

    // In production, integrate with Razorpay here
    // For now, return mock payment URL
    return {
      transactionId: transaction._id.toString(),
      paymentUrl: `https://payments.chanakyaai.com/pay/${orderId}`,
      amount: addMoneyDto.amount,
      status: TransactionStatus.PENDING,
    };
  }

  async withdrawMoney(userId: string, withdrawMoneyDto: WithdrawMoneyDto) {
    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < withdrawMoneyDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Deduct from wallet
    wallet.balance -= withdrawMoneyDto.amount;
    await wallet.save();

    // Create transaction
    const transaction = new this.transactionModel({
      user: userId,
      type: TransactionType.DEBIT,
      amount: withdrawMoneyDto.amount,
      description: 'Withdrawal to bank account',
      status: TransactionStatus.PENDING,
      balanceAfter: wallet.balance,
      metadata: {
        bankAccount: withdrawMoneyDto.bankAccount,
      },
    });

    await transaction.save();

    const estimatedCompletion = new Date();
    estimatedCompletion.setHours(estimatedCompletion.getHours() + 24);

    return {
      transactionId: transaction._id.toString(),
      amount: withdrawMoneyDto.amount,
      status: TransactionStatus.PENDING,
      estimatedCompletion: estimatedCompletion.toISOString(),
    };
  }

  async creditWallet(
    userId: string,
    amount: number,
    description: string,
    propertyId?: string,
    bountyId?: string,
  ): Promise<void> {
    const wallet = await this.getOrCreateWallet(userId);

    wallet.balance += amount;
    wallet.lifetimeEarnings += amount;
    await wallet.save();

    const transaction = new this.transactionModel({
      user: userId,
      type: TransactionType.CREDIT,
      amount,
      description,
      property: propertyId,
      bounty: bountyId,
      status: TransactionStatus.COMPLETED,
      balanceAfter: wallet.balance,
    });

    await transaction.save();
  }

  async debitWallet(
    userId: string,
    amount: number,
    description: string,
  ): Promise<void> {
    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balance -= amount;
    await wallet.save();

    const transaction = new this.transactionModel({
      user: userId,
      type: TransactionType.DEBIT,
      amount,
      description,
      status: TransactionStatus.COMPLETED,
      balanceAfter: wallet.balance,
    });

    await transaction.save();
  }

  private async getTransactionSummary(userId: string) {
    const [creditTransactions, debitTransactions] = await Promise.all([
      this.transactionModel.aggregate([
        {
          $match: {
            user: userId,
            type: TransactionType.CREDIT,
            status: TransactionStatus.COMPLETED,
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.transactionModel.aggregate([
        {
          $match: {
            user: userId,
            type: TransactionType.DEBIT,
            status: TransactionStatus.COMPLETED,
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalCredit = creditTransactions[0]?.total || 0;
    const totalDebit = debitTransactions[0]?.total || 0;

    return {
      totalCredit,
      totalDebit,
      netEarnings: totalCredit - totalDebit,
    };
  }
}
