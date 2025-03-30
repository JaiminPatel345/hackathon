import {Response} from "express";
import {formatResponse} from "../types/custom.types.js";

const handleError = (error: any , res:Response) => {
  console.log("Error :",error)

  res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Unknown error", {error}));
}

export default handleError;