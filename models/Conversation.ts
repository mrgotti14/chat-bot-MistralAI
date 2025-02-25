import { Schema, model, models } from 'mongoose';
import messageSchema from './Message';

/**
 * Interface representing a message in a conversation
 * @interface IMessage
 * 
 * @property {('user'|'assistant')} role - Identifies who sent the message
 * @property {string} content - The message content
 * @property {Date} createdAt - Message timestamp
 */
export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

/**
 * Interface representing a complete conversation
 * @interface IConversation
 * 
 * @property {string} _id - MongoDB unique identifier
 * @property {string} title - Conversation title
 * @property {IMessage[]} messages - Array of messages in the conversation
 * @property {string} userId - Reference to the user who owns the conversation
 * @property {Date} createdAt - Conversation creation timestamp
 * @property {Date} updatedAt - Last message timestamp
 */
export interface IConversation {
  _id: string;
  title: string;
  messages: IMessage[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for conversations
 * Includes embedded message documents and user reference
 */
const conversationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Conversation = models.Conversation || model<IConversation>('Conversation', conversationSchema);

export default Conversation; 