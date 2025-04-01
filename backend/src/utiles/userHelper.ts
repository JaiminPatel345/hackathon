import { Request } from 'express';
import mongoose from 'mongoose';
import {AppError} from "../types/custom.types.js";
import User from "../model/user.model.js";


// Get user from the request object
export const getUserFromRequest = async (req: Request) => {
  const username = req.username;

  if (!username) {
    throw new AppError("Authentication required", 401);
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

// Check if user exists by ID
export const validateUserExists = async (userId: mongoose.Types.ObjectId | string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Target user not found", 404);
  }

  return user;
};

// Check if target user is blocked
export const validateUserNotBlocked = (user: any, targetUserId: mongoose.Types.ObjectId | string) => {
  const isBlocked = user.blockedUsers.some(
    (id: mongoose.Types.ObjectId) => id.toString() === targetUserId.toString()
  );

  if (isBlocked) {
    throw new AppError("Cannot perform this action with a blocked user", 400);
  }
};

// Check if the target user is the same as current user
export const validateNotSelf = (userId: mongoose.Types.ObjectId | string, targetUserId: mongoose.Types.ObjectId | string) => {
  if (userId.toString() === targetUserId.toString()) {
    throw new AppError("Cannot perform this action on yourself", 400);
  }
};

export const validateTaskParticipant = (task: any, userId: mongoose.Types.ObjectId) => {
  if (!task.participants.some((p: mongoose.Types.ObjectId) => p.toString() === userId.toString())) {
    throw new AppError("Not authorized to access this task", 403);
  }

  return true;
};