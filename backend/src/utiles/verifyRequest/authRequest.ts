import {NextFunction, Request, Response} from "express";
import {
  ILoginRequest,
  IRegisterRequest,
  IVerifyOtpRequest
} from "../../types/request.types.js";
import {formatResponse} from "../../types/custom.types.js";
import {checkPassword} from "../hashPassword.js";
import handleError from "../handleError.js";
import {incrementWrongAttempts} from "../../redis/redisUtils.js";

export const verifyLoginRequest = (req: Request, res: Response, next: NextFunction) => {
  const {identifier, password}: ILoginRequest = req.body;
  if (!identifier || !password) {
    console.log("Wrong req body");
    res.status(401).json(formatResponse(false, "Invalid body"));
    return;
  }

  if (!checkPassword(password)) {
    console.log("Wrong password format");
    res.status(401).json(formatResponse(false, "Invalid credentials"));
    return;
  }

  next();
}

export const verifySignupRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const {name, username, password, mobile}: IRegisterRequest = req.body;

    if (!name || !username || !password || !mobile) {
      console.log("Wrong body at signup");
      res.status(401).json(formatResponse(false, "Invalid body"));
      return;
    }

    if (!checkPassword(password)) {
      console.log("Wrong password format");
      res.status(401).json(formatResponse(false, "Password is incorrect"));
      return;
    }

    const mobileCheckRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/

    if (!mobileCheckRegex.test(mobile)) {
      console.log("Wrong mobile format", mobile);
      res.status(401).json(formatResponse(false, "Invalid Mobile"));
      return;
    }

    next();

  } catch (error) {
    console.log("Error at verify signup request")
    handleError(error, res);
  }

}

export const verifyOtpRequest = (req: Request, res: Response, next: NextFunction) => {
  try{
    const {username, givenOtp}:IVerifyOtpRequest = req.body;
    if(!username || !givenOtp){
      console.log("Wrong username format");
      res.status(401).json(formatResponse(false, "Invalid username"));
      return;
    }
    if(givenOtp.length !== 4){
      console.log("Wrong givenOtp length");
      incrementWrongAttempts(username)
      res.status(401).json(formatResponse(false, "Invalid given OTP"));
      return;
    }
    next()
  }catch (error) {
    console.log("Error at verifyOtpRequest");
    handleError(error, res);
  }
}