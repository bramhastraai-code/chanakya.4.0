# Wallet Management System with Razorpay Integration

## Overview
Complete wallet management system with Razorpay payment gateway integration for deposits and admin-controlled withdrawals.

---

## Agent Wallet Endpoints

### 1. Get Wallet Balance
**GET** `/agent/wallet/balance`
- **Auth**: Required (Agent role)
- **Response**: Current balance, pending earnings, lifetime earnings

### 2. Get Transaction History
**GET** `/agent/wallet/transactions`
- **Auth**: Required (Agent role)
- **Query Params**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `type` (optional): Transaction type filter
  - `dateFrom` (optional): Start date
  - `dateTo` (optional): End date

### 3. Add Money to Wallet (Razorpay)
**POST** `/agent/wallet/add-money`
- **Auth**: Required (Agent role)
- **Body**:
```json
{
  "amount": 1000,
  "paymentMethod": "upi",
  "upiId": "user@paytm"
}
```
- **Response**: Razorpay order details
```json
{
  "success": true,
  "message": "Razorpay order created. Complete payment to add money.",
  "data": {
    "transactionId": "transaction_id",
    "orderId": "order_abc123",
    "amount": 1000,
    "currency": "INR",
    "status": "pending"
  }
}
```

### 4. Verify Payment
**POST** `/agent/wallet/verify-payment`
- **Auth**: Required (Agent role)
- **Body**:
```json
{
  "orderId": "order_abc123",
  "paymentId": "pay_xyz789",
  "signature": "razorpay_signature"
}
```
- **Response**: Payment verification and wallet credit confirmation

### 5. Request Withdrawal
**POST** `/agent/wallet/withdraw`
- **Auth**: Required (Agent role)
- **Body**:
```json
{
  "amount": 5000,
  "bankAccount": {
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "accountHolderName": "John Doe"
  }
}
```
- **Response**: Withdrawal request submitted (pending admin approval)

---

## Admin Wallet Management Endpoints

### 1. Get User Wallet
**GET** `/admin/wallet/users/:userId`
- **Auth**: Required (Admin role)
- **Response**: User's complete wallet details

### 2. Manual Wallet Adjustment
**POST** `/admin/wallet/users/:userId/adjust`
- **Auth**: Required (Admin role)
- **Body**:
```json
{
  "amount": 1000,
  "type": "credit",
  "description": "Manual adjustment by admin"
}
```

### 3. Deposit Money to User Wallet
**POST** `/admin/wallet/users/:userId/deposit`
- **Auth**: Required (Admin role)
- **Description**: Admin deposits money for commissions, rewards, refunds
- **Body**:
```json
{
  "amount": 5000,
  "description": "Commission for property sale",
  "propertyId": "property123",
  "bountyId": "bounty456"
}
```

### 4. Get Pending Withdrawals
**GET** `/admin/wallet/withdrawals/pending`
- **Auth**: Required (Admin role)
- **Query Params**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Response**: All withdrawal requests pending approval

### 5. Get All Withdrawals (with filters)
**GET** `/admin/wallet/withdrawals`
- **Auth**: Required (Admin role)
- **Query Params**:
  - `page` (optional)
  - `limit` (optional)
  - `status` (optional): pending, approved, rejected, completed, failed
  - `userId` (optional): Filter by specific user

### 6. Approve Withdrawal
**PATCH** `/admin/wallet/withdrawals/:transactionId/approve`
- **Auth**: Required (Admin role)
- **Description**: Approve withdrawal and initiate Razorpay payout
- **Body**:
```json
{
  "status": "approved",
  "remarks": "Approved by admin",
  "payoutId": "razorpay_payout_123"
}
```

### 7. Reject Withdrawal
**PATCH** `/admin/wallet/withdrawals/:transactionId/reject`
- **Auth**: Required (Admin role)
- **Description**: Reject withdrawal and refund to user wallet
- **Body**:
```json
{
  "remarks": "Invalid bank details"
}
```

### 8. Complete Withdrawal
**POST** `/admin/wallet/withdrawals/:transactionId/complete`
- **Auth**: Required (Admin role)
- **Description**: Mark withdrawal as completed after bank transfer
- **Body**:
```json
{
  "payoutId": "razorpay_payout_123",
  "remarks": "Transfer completed successfully"
}
```

### 9. Get Wallet Statistics
**GET** `/admin/wallet/statistics`
- **Auth**: Required (Admin role)
- **Response**: Overall wallet statistics
```json
{
  "success": true,
  "data": {
    "totalWallets": 150,
    "totalBalance": 250000,
    "pendingWithdrawals": {
      "amount": 50000
    },
    "completedWithdrawals": {
      "amount": 100000,
      "count": 25
    },
    "totalDeposits": {
      "amount": 500000,
      "count": 200
    }
  }
}
```

### 10. Get User Transactions
**GET** `/admin/wallet/transactions/users/:userId`
- **Auth**: Required (Admin role)
- **Query Params**: Same as agent transaction history

---

## Razorpay Integration

### Payment Flow (Add Money)
1. Agent initiates payment via `/agent/wallet/add-money`
2. Backend creates Razorpay order
3. Frontend integrates Razorpay checkout
4. After payment, frontend calls `/agent/wallet/verify-payment`
5. Backend verifies signature and credits wallet

### Withdrawal Flow
1. Agent submits withdrawal request
2. Money is deducted from wallet immediately
3. Admin reviews pending withdrawals
4. Admin approves → Razorpay payout initiated
5. Admin marks as completed after successful transfer
6. If rejected → Amount refunded to wallet

---

## Transaction Types
- `CREDIT`: Money added to wallet
- `DEBIT`: Money deducted from wallet
- `DEPOSIT`: Admin deposit (commission, reward)
- `WITHDRAWAL`: User withdrawal request
- `COMMISSION`: Property sale commission
- `BOUNTY_REWARD`: Bounty completion reward
- `SUBSCRIPTION`: Subscription payment
- `PENALTY`: Admin penalty
- `ADJUSTMENT`: Manual admin adjustment

## Transaction Status
- `PENDING`: Awaiting processing
- `APPROVED`: Approved by admin (withdrawal)
- `COMPLETED`: Successfully completed
- `FAILED`: Failed transaction
- `CANCELLED`: Cancelled by user/admin

---

## Environment Variables
```env
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
```

---

## Notes
- All amounts are in INR (Indian Rupees)
- Minimum withdrawal: ₹100
- Razorpay X (Payouts) required for withdrawal features
- Payment signature verification ensures security
- Admin approval required for all withdrawals
