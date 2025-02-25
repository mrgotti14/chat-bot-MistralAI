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