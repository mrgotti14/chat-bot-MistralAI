import { Schema, model, models } from 'mongoose';
import messageSchema from './Message';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface IConversation {
  _id: string;
  title: string;
  messages: IMessage[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

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

// Middleware pour mettre à jour updatedAt avant chaque sauvegarde
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Conversation = models.Conversation || model<IConversation>('Conversation', conversationSchema);

export default Conversation; 