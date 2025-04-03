import {NextFunction, Request, Response} from 'express';
import {AppError} from "../../types/custom.types.js";
import {IConversationType} from "../../types/conversation.types.js";
import handleError from "../handleError.js";

export const verifyChatRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const {type, participants} = req.body;

    if (!type || !Object.values(IConversationType).includes(type)) {
      throw new AppError("Invalid conversation type", 400);
    }

    if(type === IConversationType.PERSONAL && !participants){
      throw new AppError("Can't be alone in personal conversation ", 400);
    }

    if (participants && !Array.isArray(participants)) {
      throw new AppError("Participants must be an array", 400);
    }

    if (type === IConversationType.PERSONAL && participants.length !== 1) {
      throw new AppError("Personal conversations must have exactly one other participant", 400);
    }

    if (type === IConversationType.COMMUNITY && !req.body.title) {
      throw new AppError("Community conversations must have a title", 400);
    }

    next();
  } catch (error) {
    console.log("Error in verifyChatRequest");
    handleError(error, res);
  }
};