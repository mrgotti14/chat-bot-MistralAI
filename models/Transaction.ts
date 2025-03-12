import { Schema, model, models } from 'mongoose';

/**
 * Transaction interface for Stripe payment events
 * @interface ITransaction
 * 
 * @property {string} userId - MongoDB user ID
 * @property {string} stripeCustomerId - Stripe customer ID
 * @property {string} [stripeSubscriptionId] - Stripe subscription ID (optional)
 * @property {string} [stripeInvoiceId] - Stripe invoice ID (optional)
 * @property {string} [stripePaymentIntentId] - Stripe payment intent ID (optional)
 * @property {number} amount - Transaction amount in smallest currency unit (e.g., cents)
 * @property {string} currency - Three-letter currency code (e.g., 'usd')
 * @property {string} status - Transaction status (succeeded, failed, pending, refunded)
 * @property {string} type - Transaction type (subscription events, payments, refunds)
 * @property {Record<string, any>} [metadata] - Additional transaction data
 * @property {Date} createdAt - Transaction timestamp
 */
export interface ITransaction {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripeInvoiceId?: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  type: 'subscription_created' | 'subscription_updated' | 'subscription_deleted' | 'payment_succeeded' | 'payment_failed' | 'refund';
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Mongoose schema for Stripe transactions
 * Stores all payment-related events and their details
 */
const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stripeCustomerId: {
    type: String,
    required: true
  },
  stripeSubscriptionId: {
    type: String,
    required: false
  },
  stripeInvoiceId: {
    type: String,
    required: false
  },
  stripePaymentIntentId: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['succeeded', 'failed', 'pending', 'refunded'],
    required: true
  },
  type: {
    type: String,
    enum: ['subscription_created', 'subscription_updated', 'subscription_deleted', 'payment_succeeded', 'payment_failed', 'refund'],
    required: true
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transaction = models.Transaction || model<ITransaction>('Transaction', transactionSchema);

export default Transaction; 