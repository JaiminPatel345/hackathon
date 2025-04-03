// controller/chat.controller.ts
import {Request, Response} from 'express';
import mongoose from "mongoose";
import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";
import {AppError, formatResponse} from "../types/custom.types.js";
import handleError from "../utiles/handleError.js";
import {
  ICreateConversationRequest,
  IEditMessageRequest,
  IMarkAsReadRequest,
  ISendMessageRequest,
  IUpdateConversationRequest
} from "../types/request.types.js";
import {getUserFromRequest} from "../utiles/userHelper.js";
import {IConversationType} from "../types/conversation.types.js";
import {IMessageType} from "../types/message.types.js";
import {
  getConversationByIdFromDB,
  getMessageById,
  validateConversationParticipant
} from "../utiles/chatHelper.js";

// Create a new conversation
export const createConversation = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      participants
    }: ICreateConversationRequest = req.body;

    const user = await getUserFromRequest(req);
    const userId = user._id;

    const allParticipants = participants ? [...new Set([userId.toString(), ...participants])] : [userId.toString()];
    const participantObjectIds = allParticipants.map(id => new mongoose.Types.ObjectId(id));


    if (type === IConversationType.PERSONAL && allParticipants.length === 2) {
      const existingConversation = await Conversation.findOne({
        type: IConversationType.PERSONAL,
        participants: {$all: participantObjectIds}
      });

      if (existingConversation) {
        res.status(200).json(formatResponse(true, "Existing conversation found", existingConversation));
        return;
      }
    }


    const newConversation = new Conversation({
      title,
      description,
      type,
      participants: participantObjectIds,
      readBy: [userId],
    });

    await newConversation.save();

    res.status(201).json(formatResponse(true, "Conversation created successfully", newConversation));

  } catch (error) {
    handleError(error, res, "Error creating conversation");
  }
};

// Get all conversations for a user
export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    const userId = user._id;

    const conversations = await Conversation.find({
      participants: userId
    })
        .sort({updatedAt: -1})
        .populate('participants', 'username avatar')
        .populate('lastMessage');

    res.json(formatResponse(true, "Conversations retrieved successfully", conversations));

  } catch (error) {
    handleError(error, res, "Error fetching conversations");
  }
};

// Get a specific conversation by ID
export const getConversationById = async (req: Request, res: Response) => {
  try {
    const {conversationId} = req.params;
    const user = await getUserFromRequest(req);
    const userId = user._id;
    console.log("User name : ", user.username);

    const conversation = await Conversation.findById(conversationId)
        .populate('participants', 'username avatar')
        .populate('lastMessage');

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    // Ensure user is a participant
    validateConversationParticipant(conversation, userId);

    res.json(formatResponse(true, "Conversation retrieved successfully", {conversation}));

  } catch (error) {
    handleError(error, res, "Error fetching conversation");
  }
};

// Update conversation details (title, description)
export const updateConversation = async (req: Request, res: Response) => {
  try {
    const {
      conversationId,
      title,
      description
    }: IUpdateConversationRequest = req.body;

    const user = await getUserFromRequest(req);
    const userId = user._id;

    const conversation = await getConversationByIdFromDB(conversationId);

    // Ensure user is a participant
    validateConversationParticipant(conversation, userId);

    // Update fields if provided
    if (title !== undefined) conversation.title = title;
    if (description !== undefined) conversation.description = description;

    await conversation.save();

    res.json(formatResponse(true, "Conversation updated successfully", conversation));

  } catch (error) {
    handleError(error, res, "Error updating conversation");
  }
};

//join any community
//TODO: check if not personal then add
export const joinCommunity = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    const userId = user._id;
    const {conversationId} = req.params;

    const conversation = await getConversationByIdFromDB(conversationId);

    if (conversation.type === IConversationType.PERSONAL) {
      throw new AppError("Can't add in personal chat ", 404);
    }

    const newConversation = await Conversation.findByIdAndUpdate(conversationId, {
      $addToSet: {participants: userId},
    }, {new: true});


    res.status(201).json(formatResponse(true, "Community joined successfully", {newConversation}));


  } catch (error) {
    handleError(error, res, "Error joining community");
  }
}


// Delete a conversation (soft delete not implemented as it wasn't in your model)
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const {conversationId} = req.params;
    const user = await getUserFromRequest(req);
    const userId = user._id;

    const conversation = await getConversationByIdFromDB(conversationId);

    // Ensure user is a participant
    validateConversationParticipant(conversation, userId);

    // Delete the conversation and all associated messages
    await Message.deleteMany({conversation: conversationId});
    await Conversation.findByIdAndDelete(conversationId);

    res.json(formatResponse(true, "Conversation deleted successfully"));

  } catch (error) {
    handleError(error, res, "Error deleting conversation");
  }
};

// Send a new message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const {
      conversationId,
      content,
      type = IMessageType.TEXT,
      replyTo
    }: ISendMessageRequest = req.body;

    const user = await getUserFromRequest(req);
    const userId = user._id;

    const conversation = await getConversationByIdFromDB(conversationId);

    // Ensure user is a participant
    validateConversationParticipant(conversation, userId);

    // Create new message
    const newMessage = new Message({
      conversation: conversationId,
      sender: userId,
      type,
      content,
      deletedFor: [],
      isDeleted: false,
      isEdited: false,
      ...(replyTo && {replyTo})
    });

    await newMessage.save();

    // Update conversation with last message and read status
    conversation.lastMessage = newMessage._id;
    conversation.readBy = [userId]; // Reset read status to only sender
    await conversation.save();

    // Populate sender info before returning
    await newMessage.populate('sender', 'username avatar');
    if (replyTo) {
      await newMessage.populate('replyTo');
    }

    res.status(201).json(formatResponse(true, "Message sent successfully", newMessage));

  } catch (error) {
    handleError(error, res, "Error sending message");
  }
};

// Get messages for a conversation
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const {conversationId} = req.params;
    const user = await getUserFromRequest(req);
    const userId = user._id;

    // Optional pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const conversation = await getConversationByIdFromDB(conversationId);

    // Ensure user is a participant
    validateConversationParticipant(conversation, userId);

    // Get messages that are not deleted or not deleted for this user
    const messages = await Message.find({
      conversation: conversationId,
      $or: [
        {isDeleted: false},
        {deletedFor: {$ne: userId}}
      ]
    })
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate('sender', 'username avatar')
        .populate({
          path: 'replyTo',
          populate: {
            path: 'sender',
            select: 'username avatar'
          }
        });

    // Mark conversation as read by this user
    if (!conversation.readBy.includes(userId)) {
      conversation.readBy.push(userId);
      await conversation.save();
    }

    res.json(formatResponse(true, "Messages retrieved successfully", messages));

  } catch (error) {
    handleError(error, res, "Error fetching messages");
  }
};

// Edit a message
export const editMessage = async (req: Request, res: Response) => {
  try {
    const {
      messageId,
      content
    }: IEditMessageRequest = req.body;

    const user = await getUserFromRequest(req);
    const userId = user._id;

    const message = await getMessageById(messageId);

    // Ensure user is the sender
    if (message.sender.toString() !== userId.toString()) {
      throw new AppError("You can only edit your own messages", 403);
    }

    // Ensure message is not deleted
    if (message.isDeleted) {
      throw new AppError("Cannot edit a deleted message", 400);
    }

    // Use the editMessage method from the schema
    await message.editMessage(content);

    // Populate sender info before returning
    await message.populate('sender', 'username avatar');
    if (message.replyTo) {
      await message.populate('replyTo');
    }

    res.json(formatResponse(true, "Message edited successfully", message));

  } catch (error) {
    handleError(error, res, "Error editing message");
  }
};

// Delete a message (soft delete)
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const {messageId} = req.params;
    const user = await getUserFromRequest(req);
    const userId = user._id;

    const message = await getMessageById(messageId);

    // Check if user is the sender
    const isSender = message.sender.toString() === userId.toString();

    if (isSender) {
      // If sender is deleting, use soft delete for everyone
      await message.softDelete();
    } else {
      // For non-senders, just add to deletedFor array
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }
    }

    res.json(formatResponse(true, "Message deleted successfully", null));

  } catch (error) {
    handleError(error, res, "Error deleting message");
  }
};

// Mark conversation as read
export const markConversationAsRead = async (req: Request, res: Response) => {
  try {
    const {
      conversationId
    }: IMarkAsReadRequest = req.body;

    const user = await getUserFromRequest(req);
    const userId = user._id;

    const conversation = await getConversationByIdFromDB(conversationId);

    // Ensure user is a participant
    validateConversationParticipant(conversation, userId);

    // Add user to readBy if not already there
    if (!conversation.readBy.some(id => id.toString() === userId.toString())) {
      conversation.readBy.push(userId);
      await conversation.save();
    }

    res.json(formatResponse(true, "Conversation marked as read", conversation));

  } catch (error) {
    handleError(error, res, "Error marking conversation as read");
  }
};
