import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './entities/wallet.entity';
import {
  Transaction,
  TransactionDocument,
} from './entities/transaction.entity';
import { TransactionType, TransactionStatus } from './enum/transaction.enum';
import { AddMoneyDto } from './dto/add-money.dto';
import { WithdrawMoneyDto } from './dto/withdraw-money.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { RazorpayService } from './razorpay.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private readonly razorpayService: RazorpayService,
  ) {}

  async getOrCreateWallet(
    userId: string | Types.ObjectId,
  ): Promise<WalletDocument> {
    const userObjectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    let wallet = await this.walletModel.findOne({ user: userObjectId });

    if (!wallet) {
      wallet = new this.walletModel({
        user: userObjectId,
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

    // Create Razorpay order
    const razorpayOrder = await this.razorpayService.createOrder(
      addMoneyDto.amount,
      userId,
      {
        paymentMethod: addMoneyDto.paymentMethod,
        upiId: addMoneyDto.upiId,
      },
    );

    // Create pending transaction
    const transaction = new this.transactionModel({
      user: userId,
      type: TransactionType.CREDIT,
      amount: addMoneyDto.amount,
      description: 'Wallet top-up',
      status: TransactionStatus.PENDING,
      balanceAfter: wallet.balance,
      orderId: razorpayOrder.orderId,
      metadata: {
        paymentMethod: addMoneyDto.paymentMethod,
        upiId: addMoneyDto.upiId,
        razorpayOrderId: razorpayOrder.orderId,
      },
    });

    await transaction.save();

    return {
      transactionId: transaction._id.toString(),
      orderId: razorpayOrder.orderId,
      amount: razorpayOrder.amount / 100, // Convert paise to rupees
      currency: razorpayOrder.currency,
      status: TransactionStatus.PENDING,
    };
  }

  async verifyAndCreditPayment(userId: string, verifyDto: VerifyPaymentDto) {
    // Verify payment signature
    const isValid = this.razorpayService.verifyPaymentSignature(
      verifyDto.orderId,
      verifyDto.paymentId,
      verifyDto.signature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }

    // Find transaction by order ID
    const transaction = await this.transactionModel.findOne({
      user: userId,
      orderId: verifyDto.orderId,
      status: TransactionStatus.PENDING,
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found or already processed');
    }

    // Update transaction
    transaction.status = TransactionStatus.COMPLETED;
    transaction.paymentId = verifyDto.paymentId;
    transaction.metadata = {
      ...transaction.metadata,
      verifiedAt: new Date(),
      signature: verifyDto.signature,
    };

    // Credit wallet
    const wallet = await this.getOrCreateWallet(userId);
    wallet.balance += transaction.amount;
    transaction.balanceAfter = wallet.balance;

    await Promise.all([transaction.save(), wallet.save()]);

    return {
      transactionId: transaction._id.toString(),
      amount: transaction.amount,
      newBalance: wallet.balance,
      status: TransactionStatus.COMPLETED,
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

  // === Admin Methods ===

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
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.getOrCreateWallet(userId);

    // Create transaction record
    const transaction = new this.transactionModel({
      user: userId,
      type: TransactionType.DEPOSIT,
      amount,
      description,
      status: TransactionStatus.COMPLETED,
      balanceAfter: wallet.balance + amount,
      metadata: {
        adminId,
        propertyId,
        bountyId,
        depositedBy: 'admin',
      },
    });

    // Update wallet
    wallet.balance += amount;
    wallet.lifetimeEarnings += amount;

    await Promise.all([wallet.save(), transaction.save()]);

    return { wallet, transaction };
  }

  /**
   * Admin: Manual adjustment
   */
  async manualAdjustment(
    userId: string,
    amount: number,
    type: TransactionType,
    description: string,
    adminId: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.getOrCreateWallet(userId);

    // If adding money
    if (
      type === TransactionType.CREDIT ||
      type === TransactionType.DEPOSIT ||
      type === TransactionType.ADJUSTMENT
    ) {
      const transaction = new this.transactionModel({
        user: userId,
        type: TransactionType.ADJUSTMENT,
        amount,
        description,
        status: TransactionStatus.COMPLETED,
        balanceAfter: wallet.balance + amount,
        metadata: { adminId },
      });

      wallet.balance += amount;
      wallet.lifetimeEarnings += amount;

      await Promise.all([wallet.save(), transaction.save()]);
      return { wallet, transaction };
    }

    // If removing money
    if (
      type === TransactionType.DEBIT ||
      type === TransactionType.WITHDRAWAL ||
      type === TransactionType.PENALTY
    ) {
      if (wallet.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const transaction = new this.transactionModel({
        user: userId,
        type: TransactionType.ADJUSTMENT,
        amount,
        description,
        status: TransactionStatus.COMPLETED,
        balanceAfter: wallet.balance - amount,
        metadata: { adminId },
      });

      wallet.balance -= amount;

      await Promise.all([wallet.save(), transaction.save()]);
      return { wallet, transaction };
    }

    throw new BadRequestException('Invalid transaction type for adjustment');
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
        .populate('user', 'name email phoneNumber')
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
    if (userId) query.user = new Types.ObjectId(userId);

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(query)
        .populate('user', 'name email phoneNumber')
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
    // const payout = await this.razorpayService.createPayout({...});

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
    const wallet = await this.getOrCreateWallet(transaction.user as any);
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
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
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
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
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

  /**
   * Get transactions with filters (for admin)
   */
  async getTransactionsWithFilters(
    userId: Types.ObjectId | string,
    filters: any = {},
  ) {
    const { page = 1, limit = 20, type, status, startDate, endDate } = filters;
    const userObjectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    const query: any = { user: userObjectId };

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
}
