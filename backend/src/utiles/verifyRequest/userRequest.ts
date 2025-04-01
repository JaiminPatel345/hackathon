import {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import {IGoalLevel} from '../../types/user.types.js';
import {formatResponse} from "../../types/custom.types.js";

// Verify a buddy request contains a valid userId
export const verifyBuddyRequest = (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json(formatResponse(false, "Valid user ID is required"));
    return;
  }

  next();
};

// Verify make buddy request
export const verifyMakeBuddyRequest = (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json(formatResponse(false, "Valid user ID is required"));
    return;
  }

  next();
};

// Verify add to buddies request
export const verifyAddBuddiesRequest = (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json(formatResponse(false, "Valid user ID is required"));
    return;
  }

  next();
};

// Reusing the existing verification function for profile updates
export const verifyUpdateUserRequest = (req: Request, res: Response, next: NextFunction) => {
  const {interests, goal, avatar} = req.body;

  // Validate interests if provided
  if (interests && (!Array.isArray(interests) || interests.some(i => typeof i !== 'string'))) {
    res.status(400).json(formatResponse(false, "Interests must be an array of strings"));
    return;
  }

  // Validate goal if provided
  if (goal) {
    const {title, target, year} = goal;
    const level = goal.level as IGoalLevel;

    if (title && typeof title !== 'string' || target && typeof target !== 'string') {
      res.status(400).json(formatResponse(false, "Goal title and target must be strings"));
      return;
    }

    if (year && typeof year !== 'number') {
      res.status(400).json(formatResponse(false, "Goal year must be numbers"));
      return;
    }

    if (level && !Object.values(IGoalLevel).includes(level)) {
      res.status(400).json(formatResponse(false, "Goal level must be EXPERT, INTERMEDIATE or BEGINNER"));
      return;
    }
  }

  // Validate avatar URL if provided
  if (avatar && typeof avatar !== 'string') {
    res.status(400).json(formatResponse(false, "Avatar must be a valid URL string"));
    return;
  }

  next();
};

export const verifyBuddyRequestParams = (req: Request, res: Response, next: NextFunction) => {
  const {userId, type} = req.body;

  // Validate userId
  if (!userId) {
    res.status(400).json(formatResponse(false, "User ID is required"));
    return;
  }

  // Validate type
  if (!type || !['buddy', 'follower'].includes(type)) {
    res.status(400).json(formatResponse(false, "Valid request type is required (buddy or follower)"));
    return;
  }

  next();
};