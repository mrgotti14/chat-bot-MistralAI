import { Schema } from 'mongoose';

/**
 * Mongoose schema for chat messages
 * Used as a subdocument in Conversation schema
 * 
 * @property {string} role - Either 'user' or 'assistant'
 * @property {string} content - Message content with markdown support
 * @property {Date} createdAt - Message timestamp
 */
const messageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default messageSchema; 