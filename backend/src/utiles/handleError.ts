import {Response} from 'express';

import mongoose from 'mongoose';
import {AppError, formatResponse} from "../types/custom.types.js";

const handleError = (error: any, res: Response, message?: string) => {
  if (message) {
    console.log(message);
  }
  console.error(error);

  // Handle AppError instances
  if (error instanceof AppError) {
    res.status(error.statusCode).json(formatResponse(false, error.message));
    return
  }

  // Handle Mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map(err => err.message);
    res.status(400).json(formatResponse(false, "Validation error", {errors: messages}));
    return
  }

  // Handle duplicate key errors from MongoDB
  if (error.code === 11000) {
    res.status(400).json(formatResponse(false, "Duplicate key error"));
    return
  }

  // Default error response
  res.status(500).json(formatResponse(false, "Internal server error"));
};

export default handleError;