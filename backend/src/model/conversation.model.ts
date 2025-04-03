import mongoose, {Schema} from "mongoose";
import {IConversation, IConversationType} from "../types/conversation.types.js";


const ConversationSchema = new Schema<IConversation>({
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(IConversationType),
    required: true
  },
  participants: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
});

ConversationSchema.index({participants: 1, createdAt: -1});

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema)
export default Conversation;
