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

  /**
   * Admin: Deposit money to user wallet
   */
  async adminDeposit(
    userId: string,
    amount: number,
    description: string,
    adminId: string,
    propertyId?: string,
    bountyId?: string,
  ) {
    const userObjectId = new Types.ObjectId(userId);

    return this.credit(
      userObjectId,
      amount,
      TransactionType.DEPOSIT,
      description,
      {
        adminId,
        propertyId,
        bountyId,
        depositedBy: 'admin',
      },
    );
  }

  /**
   * Get pending withdrawal requests
   */
  async getPendingWithdrawals(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find({
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
        })
        .populate('userId', 'name email phoneNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments({
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
      }),
    ]);

    return {
      withdrawals: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all withdrawal requests with filters
   */
  async getWithdrawals(filters: any) {
    const { page = 1, limit = 20, status, userId } = filters;
    const skip = (page - 1) * limit;

    const query: any = { type: TransactionType.WITHDRAWAL };
    if (status) query.status = status;
    if (userId) query.userId = new Types.ObjectId(userId);

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(query)
        .populate('userId', 'name email phoneNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(query),
    ]);

    return {
      withdrawals: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin: Approve withdrawal request
   */
  async approveWithdrawal(
    transactionId: string,
    adminId: string,
    remarks?: string,
    payoutId?: string,
  ) {
    const transaction = await this.transactionModel.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.type !== TransactionType.WITHDRAWAL) {
      throw new BadRequestException('Not a withdrawal transaction');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException(
        `Withdrawal is already ${transaction.status}`,
      );
    }

    // Update transaction status
    transaction.status = TransactionStatus.APPROVED;
    transaction.metadata = {
      ...transaction.metadata,
      approvedBy: adminId,
      approvedAt: new Date(),
      remarks,
      payoutId,
    };
    await transaction.save();

    // TODO: Integrate Razorpay Payout API here
    // const payout = await this.razorpayService.createPayout({
    //   account_number: transaction.metadata.bankAccount.accountNumber,
    //   amount: transaction.amount * 100, // Convert to paise
    //   currency: 'INR',
    //   mode: 'IMPS',
    //   purpose: 'payout',
    //   fund_account: {
    //     account_type: 'bank_account',
    //     bank_account: {
    //       name: transaction.metadata.bankAccount.accountHolderName,
    //       ifsc: transaction.metadata.bankAccount.ifscCode,
    //       account_number: transaction.metadata.bankAccount.accountNumber,
    //     },
    //   },
    // });

    return transaction;
  }

  /**
   * Admin: Reject withdrawal request
   */
  async rejectWithdrawal(
    transactionId: string,
    adminId: string,
    remarks?: string,
  ) {
    const transaction = await this.transactionModel.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.type !== TransactionType.WITHDRAWAL) {
      throw new BadRequestException('Not a withdrawal transaction');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException(
        `Withdrawal is already ${transaction.status}`,
      );
    }

    // Update transaction status
    transaction.status = TransactionStatus.FAILED;
    transaction.metadata = {
      ...transaction.metadata,
      rejectedBy: adminId,
      rejectedAt: new Date(),
      remarks,
    };
    await transaction.save();

    // Refund amount to wallet
    const wallet = await this.getWallet(transaction.user as any);
    wallet.balance += transaction.amount;
    await wallet.save();

    return {
      transaction,
      refundedAmount: transaction.amount,
      newBalance: wallet.balance,
    };
  }

  /**
   * Admin: Mark withdrawal as completed
   */
  async completeWithdrawal(
    transactionId: string,
    adminId: string,
    payoutId?: string,
    remarks?: string,
  ) {
    const transaction = await this.transactionModel.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.type !== TransactionType.WITHDRAWAL) {
      throw new BadRequestException('Not a withdrawal transaction');
    }

    if (
      ![TransactionStatus.PENDING, TransactionStatus.APPROVED].includes(
        transaction.status,
      )
    ) {
      throw new BadRequestException(
        `Cannot complete withdrawal with status: ${transaction.status}`,
      );
    }

    // Update transaction status
    transaction.status = TransactionStatus.COMPLETED;
    transaction.metadata = {
      ...transaction.metadata,
      completedBy: adminId,
      completedAt: new Date(),
      payoutId,
      remarks,
    };
    await transaction.save();

    return transaction;
  }

  /**
   * Get wallet statistics
   */
  async getWalletStatistics() {
    const [
      totalWallets,
      totalBalance,
      totalPendingWithdrawals,
      totalCompletedWithdrawals,
      totalDeposits,
    ] = await Promise.all([
      this.walletModel.countDocuments(),
      this.walletModel.aggregate([
        { $group: { _id: null, total: { $sum: '$balance' } } },
      ]),
      this.transactionModel.aggregate([
        {
          $match: {
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.PENDING,
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.transactionModel.aggregate([
        {
          $match: {
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.COMPLETED,
          },
        },
        {
          $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } },
        },
      ]),
      this.transactionModel.aggregate([
        {
          $match: {
            type: TransactionType.DEPOSIT,
            status: TransactionStatus.COMPLETED,
          },
        },
        {
          $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } },
        },
      ]),
    ]);

    return {
      totalWallets,
      totalBalance: totalBalance[0]?.total || 0,
      pendingWithdrawals: {
        amount: totalPendingWithdrawals[0]?.total || 0,
      },
      completedWithdrawals: {
        amount: totalCompletedWithdrawals[0]?.total || 0,
        count: totalCompletedWithdrawals[0]?.count || 0,
      },
      totalDeposits: {
        amount: totalDeposits[0]?.total || 0,
        count: totalDeposits[0]?.count || 0,
      },
    };
  }
}
