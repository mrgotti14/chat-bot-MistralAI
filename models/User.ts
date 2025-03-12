import { Schema, model, models } from 'mongoose';

/**
 * User interface supporting multiple authentication methods
 * @interface IUser
 * 
 * @property {string} _id - MongoDB unique identifier
 * @property {string} name - User's full name
 * @property {string} email - User's unique email address
 * @property {string} [password] - Hashed password (optional for OAuth users)
 * @property {string} [image] - User's avatar URL
 * @property {Date} [emailVerified] - Email verification timestamp
 * @property {string} [stripeCustomerId] - Stripe customer ID
 * @property {string} [subscriptionId] - Current Stripe subscription ID
 * @property {string} [subscriptionStatus] - Status of the subscription (active, canceled, etc.)
 * @property {Date} [subscriptionEnd] - End date of current subscription period
 * @property {string} [subscriptionTier] - Current subscription tier (free, pro, business)
 * @property {number} [dailyMessageCount] - Number of messages sent today
 * @property {Date} [lastMessageDate] - Last message sent date
 * @property {number} [activeConversations] - Number of active conversations
 * @property {number} [apiRequestsCount] - Number of API requests made
 * @property {Date} [apiRequestsResetDate] - Date when API requests reset
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last modification timestamp
 */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  subscriptionEnd?: Date;
  subscriptionTier?: 'free' | 'pro' | 'business';
  dailyMessageCount?: number;
  lastMessageDate?: Date;
  activeConversations?: number;
  apiRequestsCount?: number;
  apiRequestsResetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for users
 * Supports both email/password and OAuth authentication
 */
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  emailVerified: {
    type: Date,
    required: false
  },
  stripeCustomerId: {
    type: String,
    required: false
  },
  subscriptionId: {
    type: String,
    required: false
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired'],
    required: false
  },
  subscriptionEnd: {
    type: Date,
    required: false
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'pro', 'business'],
    default: 'free'
  },
  dailyMessageCount: {
    type: Number,
    default: 0
  },
  lastMessageDate: {
    type: Date,
    default: Date.now
  },
  activeConversations: {
    type: Number,
    default: 0
  },
  apiRequestsCount: {
    type: Number,
    default: 0
  },
  apiRequestsResetDate: {
    type: Date,
    default: () => {
      const date = new Date();
      date.setDate(1); // first day of the next month
      date.setMonth(date.getMonth() + 1);
      return date;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save middleware to automatically update the updatedAt timestamp
 */
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = models.User || model<IUser>('User', userSchema);

export default User; 