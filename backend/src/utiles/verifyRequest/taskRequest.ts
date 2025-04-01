import { Request, Response, NextFunction } from 'express';
import {formatResponse} from "../../types/custom.types.js";
import {TaskCategory} from "../../types/task.type.js";
import handleError from "../handleError.js";


export const verifyTaskRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, category, isPrivate } = req.body;

    // Check required fields
    if (!content) {
      res.status(400).json(formatResponse(false, "Task content is required"));
      return;
    }

    if (!category || !Object.values(TaskCategory).includes(category)) {
      res.status(400).json(formatResponse(false, "Valid task category is required"));
      return;
    }

    if (isPrivate === undefined) {
      res.status(400).json(formatResponse(false, "isPrivate field is required"));
      return;
    }


    next();
  } catch (error) {
    console.log("Error at verifyTaskRequest");
    handleError(error, res);
  }
};