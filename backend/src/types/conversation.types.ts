import mongoose, {Document, Schema} from "mongoose";

// Define as an enum instead of an object
export enum IConversationType {
  PERSONAL = 'personal',
  COMMUNITY = 'community'
}

export interface IConversation extends Document {
  title?: string;
  description?: string;
  type?: IConversationType;
  participants?: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId;
  readBy: mongoose.Types.ObjectId[];
}