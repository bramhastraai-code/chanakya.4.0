import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from '../entities/wallet.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionType, TransactionStatus } from '../enum/transaction.enum';

@Injectable()
export class WalletV1Service {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  /**
   * Get or create wallet for user
   */
  async getWallet(userId: Types.ObjectId | string) {
    // Convert string to ObjectId if needed
    const userObjectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    let wallet = await this.walletModel.findOne({ userId: userObjectId });

    if (!wallet) {
      wallet = await this.walletModel.create({
        userId: userObjectId,
        balance: 0,
        pendingEarnings: 0,
        lifetimeEarnings: 0,
      });
    }

    return wallet;
  }

  /**
   * Get transaction history
   */
  async getTransactions(userId: Types.ObjectId, filters: any = {}) {
    const { page = 1, limit = 20, type, status, startDate, endDate } = filters;
    const query: any = { userId };

    if (type) query.type = type;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.transactionModel.countDocuments(query),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Credit amount to wallet (e.g., Commission, Reward, Deposit)
   */
  async credit(
    userId: Types.ObjectId,
    amount: number,
    type: TransactionType,
    description: string,
    metadata?: Record<string, any>,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.getWallet(userId);

    // Create transaction record
    const transaction = await this.transactionModel.create({
      userId,
      type,
      amount,
      description,
      status: TransactionStatus.COMPLETED,
      balanceAfter: wallet.balance + amount,
      metadata,
    });

    // Update wallet
    wallet.balance += amount;

    // Update lifetime earnings if applicable
    if (
      [TransactionType.COMMISSION, TransactionType.BOUNTY_REWARD].includes(type)
    ) {
      wallet.lifetimeEarnings += amount;
    }

    await wallet.save();

    return { wallet, transaction };
  }

  /**
   * Debit amount from wallet (e.g., Withdrawal, Penalty, Subscription)
   */
  async debit(
    userId: Types.ObjectId,
    amount: number,
    type: TransactionType,
    description: string,
    metadata?: Record<string, any>,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.getWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create transaction record
    const transaction = await this.transactionModel.create({
      userId,
      type,
      amount,
      description,
      status: TransactionStatus.COMPLETED,
      balanceAfter: wallet.balance - amount,
      metadata,
    });

    // Update wallet
    wallet.balance -= amount;
    await wallet.save();

    return { wallet, transaction };
  }

  /**
   * Admin: Manual adjustment
   */
  async manualAdjustment(
    userId: string,
    amount: number,
    type: TransactionType, // CREDIT or DEBIT
    description: string,
    adminId: Types.ObjectId,
  ) {
    const userObjectId = new Types.ObjectId(userId);

    // For manual adjustment, we use the passed type (usually ADJUSTMENT)
    // but internally we check if it's adding or removing money

    // If we want to add money
    if (
      type === TransactionType.CREDIT ||
      type === TransactionType.DEPOSIT ||
      type === TransactionType.ADJUSTMENT
    ) {
      return this.credit(
        userObjectId,
        amount,
        TransactionType.ADJUSTMENT,
        description,
        { adminId },
      );
    }

    // If we want to remove money
    if (
      type === TransactionType.DEBIT ||
      type === TransactionType.WITHDRAWAL ||
      type === TransactionType.PENALTY
    ) {
      return this.debit(
        userObjectId,
        amount,
        TransactionType.ADJUSTMENT,
        description,
        { adminId },
      );
    }

    throw new BadRequestException('Invalid transaction type for adjustment');
  }
}
