import mongoose, {Document, Schema} from "mongoose";

export const IConversationType = {
  PERSONAL: 'personal',
  COMMUNITY: 'community'
};

export interface IConversation extends Document {
  title?: string;
  description?: string;
  type?: typeof IConversationType;
  participants?: mongoose.Types.ObjectId[];
  lastMessage: Schema.Types.ObjectId;
  readBy: mongoose.Types.ObjectId[];
}
