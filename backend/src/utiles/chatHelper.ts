import Conversation from "../model/conversation.model.js";
import {AppError} from "../types/custom.types.js";
import mongoose from "mongoose";
import Message from "../model/message.model.js";
import {log} from "node:util";

export const getConversationByIdFromDB = async (conversationId: string, errorMessage = "Conversation not found") => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError(errorMessage, 404);
  }
  return conversation;
};

export const validateConversationParticipant = (conversation: any, userId: mongoose.Types.ObjectId) => {
  const isParticipant = conversation.participants.some(
      (participant: any) => participant._id.toString() === userId.toString() //it has _id , username , avatar
  );


  if (!isParticipant) {
    throw new AppError("User is not a participant in this conversation", 403);
  }
};


export const getMessageById = async (messageId: string, errorMessage = "Message not found") => {
  const message = await Message.findById(messageId);
  if (!message) {
    throw new AppError(errorMessage, 404);
  }
  return message;
};
