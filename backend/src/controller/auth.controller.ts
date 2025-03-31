import {Request, Response} from "express";
import {AppError, formatResponse} from "../types/custom.types.js";
import {
  ILoginRequest,
  IRegisterRequest,
  IVerifyOtpRequest
} from "../types/request.types.js";
import User from "../model/user.model.js";
import {generateHashPassword, verifyPassword} from "../utiles/hashPassword.js";
import handleError from "../utiles/handleError.js";
import handleOtp from "../utiles/handleOtp.js";
import {getMobileAndOtp, incrementWrongAttempts} from "../redis/redisUtils.js";
import {getTokens} from "../utiles/tokens.js";

const MAX_WRONG_OTP_COUNT = 5;

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {identifier, password}: ILoginRequest = req.body;
    let hasMobile = false;
    if (identifier.includes('+')) {
      hasMobile = true;
    }

    const user = await User.findOne(hasMobile ? {mobile: identifier} : {username: identifier})
        .select('+hashPassword')
        .lean()
    if (!user) {
      console.log("User not found");
      throw new AppError("Invalid credentials", 401)
    }

    const isCorrectPassword = await verifyPassword(password, user.hashPassword);

    if (!isCorrectPassword) {
      console.log("Wrong Password");
      throw new AppError("Invalid credentials", 401)
    }

    const token = await getTokens(user.username)

    const {hashPassword, ...userWithoutPassword} = user;

    res.json(formatResponse(true, "Login Successful",
        {user: userWithoutPassword, token}));


  } catch (error: any) {
    console.log("Error at login user");
    handleError(error, res);

  }
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {name, mobile, password, username}: IRegisterRequest = req.body;

    const hashPassword = await generateHashPassword(password);

    //generate and set opt
    await handleOtp(mobile, username);


    const user = await User.create({
      name,
      mobile,
      password,
      username,
      hashPassword,
    })

    res.status(201).json(formatResponse(true, 'Created successfully', {user}));


  } catch (error) {
    console.log("Error at registerUser");
    handleError(error, res);

  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const {username, givenOtp}: IVerifyOtpRequest = req.body;
    const RedisData = await getMobileAndOtp(username);
    if (!RedisData) {
      console.log("RedisData not found");
      throw new AppError("Try to resend OTP", 401)
    }
    if (RedisData.generatedOtp.toString() === givenOtp.toString()) {
      const user = await User.findOneAndUpdate({
        username,
        isMobileVerified: true
      })
      const token = await getTokens(username)

      res.status(200).json(formatResponse(true, "OTP verified", {user, token}));
      return;
    } else {
      if (RedisData.wrongAttempts >= MAX_WRONG_OTP_COUNT) {
        throw new AppError("Wrong attempts and Max attempts reached ", 401)

      }
      await incrementWrongAttempts(username);
      throw new AppError("Wrong OTP , Try again", 401)
    }

  } catch (error) {
    console.log("Error at verifyOtp");
    handleError(error, res);
  }
}
