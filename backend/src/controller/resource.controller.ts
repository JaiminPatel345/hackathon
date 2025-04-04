import {Request, Response} from 'express';
import {getUserFromRequest} from "../utiles/userHelper.js";
import {IResourceType} from "../types/message.types.js";
import {AppError, formatResponse} from "../types/custom.types.js";
import Conversation from "../model/conversation.model.js";
import Resource from "../model/resource.model.js";
import handleError from "../utiles/handleError.js";

export const getResourcesByType = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    const type = req.query.type as IResourceType;

    if (!type) {
      throw new AppError("Type query parameter is required", 400);
    }

    // Get user's conversation IDs
    const conversations = await Conversation.find({
      participants: user._id
    }).select('_id');
    const conversationIds = conversations.map(c => c._id);

    // Find resources
    const resources = await Resource.find({
      conversation: {$in: conversationIds},
      type,
      isDeleted: false
    }).populate('uploader', 'username avatar');

    res.json(formatResponse(true, "Resources retrieved successfully", {resources}));
  } catch (error) {
    handleError(error, res, "Error fetching resources");
  }
};