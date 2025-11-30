export enum BountyType {
  LEAD_REFERRAL = 'lead_referral',
  PROPERTY_REFERRAL = 'property_referral',
  USER_REFERRAL = 'user_referral',
  TASK_COMPLETION = 'task_completion',
}

export enum BountyStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CLOSED = 'closed',
  EXPIRED = 'expired',
}

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
