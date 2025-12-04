import { Injectable } from '@nestjs/common';
import { InjectRazorpay } from 'nestjs-razorpay';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
@Injectable()
export class RazorpayService {
  private readonly keyId: string;
  private readonly keySecret: string;

  constructor(
    @InjectRazorpay() private readonly razorpayClient: any,
    private readonly configService: ConfigService,
  ) {
    // Fallback to hardcoded values if not in env
    this.keyId =
      this.configService.get<string>('RAZORPAY_KEY_ID') ||
      'rzp_live_2FhwIdAriDpU2J';
    this.keySecret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') ||
      'GjfwZCuhU933hSd4Eh1QX5da';
  }

  /**
   * Create Razorpay order for wallet top-up
   */
  async createOrder(amount: number, userId: string, notes?: any) {
    try {
      const order = await this.razorpayClient.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `wallet_${userId}_${Date.now()}`,
        notes: {
          userId,
          purpose: 'wallet_topup',
          ...notes,
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      };
    } catch (error) {
      throw new Error(`Failed to create Razorpay order: ${error.message}`);
    }
  }

  /**
   * Verify Razorpay payment signature
   */
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return generatedSignature === signature;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fetch payment details
   */
  async getPayment(paymentId: string) {
    try {
      return await this.razorpayClient.payments.fetch(paymentId);
    } catch (error) {
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  }

  /**
   * Create payout for withdrawal (requires Razorpay X)
   */
  async createPayout(payoutData: {
    accountNumber: string;
    amount: number;
    currency: string;
    mode: string;
    purpose: string;
    fundAccount: any;
    queueIfLowBalance?: boolean;
    reference_id?: string;
    narration?: string;
  }) {
    try {
      // Note: This requires Razorpay X (payouts) to be enabled
      // You'll need to use the Razorpay X API endpoint
      const response = await fetch('https://api.razorpay.com/v1/payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${this.razorpayClient.key_id}:${this.razorpayClient.key_secret}`,
          ).toString('base64')}`,
        },
        body: JSON.stringify({
          account_number: payoutData.accountNumber,
          amount: Math.round(payoutData.amount * 100), // Convert to paise
          currency: payoutData.currency,
          mode: payoutData.mode,
          purpose: payoutData.purpose,
          fund_account: payoutData.fundAccount,
          queue_if_low_balance: payoutData.queueIfLowBalance ?? true,
          reference_id: payoutData.reference_id,
          narration: payoutData.narration,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.description || 'Payout failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create payout: ${error.message}`);
    }
  }

  /**
   * Create fund account for payout
   */
  async createFundAccount(contactId: string, bankAccount: any) {
    try {
      const response = await fetch(
        'https://api.razorpay.com/v1/fund_accounts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(
              `${this.razorpayClient.key_id}:${this.razorpayClient.key_secret}`,
            ).toString('base64')}`,
          },
          body: JSON.stringify({
            contact_id: contactId,
            account_type: 'bank_account',
            bank_account: {
              name: bankAccount.accountHolderName,
              ifsc: bankAccount.ifscCode,
              account_number: bankAccount.accountNumber,
            },
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error?.description || 'Fund account creation failed',
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create fund account: ${error.message}`);
    }
  }

  /**
   * Create contact for payout
   */
  async createContact(
    name: string,
    email: string,
    contact: string,
    type: string = 'customer',
  ) {
    try {
      const response = await fetch('https://api.razorpay.com/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${this.razorpayClient.key_id}:${this.razorpayClient.key_secret}`,
          ).toString('base64')}`,
        },
        body: JSON.stringify({
          name,
          email,
          contact,
          type,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.description || 'Contact creation failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create contact: ${error.message}`);
    }
  }

  /**
   * Fetch payout details
   */
  async getPayout(payoutId: string) {
    try {
      const response = await fetch(
        `https://api.razorpay.com/v1/payouts/${payoutId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.razorpayClient.key_id}:${this.razorpayClient.key_secret}`,
            ).toString('base64')}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.description || 'Failed to fetch payout');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch payout: ${error.message}`);
    }
  }
}
