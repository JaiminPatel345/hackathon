import {NextFunction, Request, Response} from 'express';
import {formatResponse} from "../../types/custom.types.js";
import checkTokens from "../tokens.js";
import User from "../../model/user.model.js";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(formatResponse(false, "Authentication required"));
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json(formatResponse(false, "Invalid token format"));
      return;
    }

    try {
      req.username = await checkTokens(token);
      next();
    } catch (error) {
      res.status(401).json(formatResponse(false, "Invalid or expired token"));
      return;
    }
  } catch (error) {
    console.log("Error in authentication middleware");
    res.status(500).json(formatResponse(false, "Server error"));
    return;
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.username;

    if (!username) {
      res.status(401).json(formatResponse(false, "Authentication required"));
      return;
    }

    const user = await User.findOne({username});

    // Check if user has admin role
    // You'll need to add an isAdmin or role field to your User model
    if (!user || !user.isAdmin) {
      res.status(403).json(formatResponse(false, "Admin access required"));
      return;
    }

    next();
  } catch (error) {
    console.error("Error in admin verification:", error);
    res.status(500).json(formatResponse(false, "Server error during admin verification"));
    return;
  }
};
