import {NextFunction, Request, Response} from 'express';
import {formatResponse} from "../../types/custom.types.js";
import checkTokens from "../tokens.js";

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
