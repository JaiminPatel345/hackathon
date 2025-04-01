import {Request} from 'express';
import User from "../model/user.model.js";
import {AppError} from "../types/custom.types.js";
import mongoose from "mongoose";

export const getUserFromRequest = async (req: Request) => {
  const username = req.username;

  const user = await User.findOne({username});
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};


export const validateTaskParticipant = (task: any, userId: mongoose.Types.ObjectId) => {
  if (!task.participants.some((p: mongoose.Types.ObjectId) => p.toString() === userId.toString())) {
    throw new AppError("Not authorized to access this task", 403);
  }

  return true;
};