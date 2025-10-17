export enum UserType {
  USER = 'User',
  AGENT = 'Agent',
  BUILDER = 'Builder',
  ALL = 'All',
}

export enum UserStatus {
  defailt = '',
  ALL = 'all',
  ACTIVE = 'active',
  IN_ACTIVE = 'inactive',
}

export enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  CONFIRMED = 'confirmed',
  CONTACTED = 'contacted',
  CALL_LATER = 'call later',
}
export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum BrokerType {
  INDIVIDUAL = 'individual',
  AGENCY = 'agency',
}
