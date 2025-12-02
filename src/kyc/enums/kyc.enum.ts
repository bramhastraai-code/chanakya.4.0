export enum KycStatus {
  NOT_SUBMITTED = 'not_submitted',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum DocumentType {
  AADHAAR = 'aadhaar',
  PAN = 'pan',
  DRIVING_LICENSE = 'driving_license',
  PASSPORT = 'passport',
  VOTER_ID = 'voter_id',
  ADDRESS_PROOF = 'address_proof',
  PROFILE_PHOTO = 'profile_photo',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
