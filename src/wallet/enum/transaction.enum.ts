export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  COMMISSION = 'commission',
  BOUNTY_REWARD = 'bounty_reward',
  SUBSCRIPTION = 'subscription',
  PENALTY = 'penalty',
  ADJUSTMENT = 'adjustment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
