import { Response } from 'express';

import mongoose from 'mongoose';
import {AppError, formatResponse} from "../types/custom.types.js";

const handleError = (error: any, res: Response) => {
  console.error(error);

  // Handle AppError instances
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(formatResponse(false, error.message));
  }

  // Handle Mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json(formatResponse(false, "Validation error", { errors: messages }));
  }

  // Handle duplicate key errors from MongoDB
  if (error.code === 11000) {
    return res.status(400).json(formatResponse(false, "Duplicate key error"));
  }

  // Default error response
  return res.status(500).json(formatResponse(false, "Internal server error"));
};

export default handleError;