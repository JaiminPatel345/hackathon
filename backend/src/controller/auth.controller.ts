import {Request, Response} from "express";
import {AppError, formatResponse} from "../types/custom.types.js";
import {ILoginRequest, IRegisterRequest} from "../types/request.types.js";
import User from "../model/user.model.js";
import {generateHashPassword, verifyPassword} from "../utiles/hashPassword.js";
import handleError from "../utiles/handleError.js";
import handleOtp from "../utiles/handleOtp.js";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {identifier, password}: ILoginRequest = req.body;
    let hasMobile = false;
    if (identifier.includes('+')) {
      hasMobile = true;
    }

    const user = await User.findOne(hasMobile ? {mobile: identifier} : {username: identifier}).lean()
    if (!user) {
      console.log("User not found");
      throw new AppError("Invalid credentials", 401)
    }

    const isCorrectPassword = await verifyPassword(password, user.hashPassword);

    if (!isCorrectPassword) {
      console.log("Wrong Password");
      throw new AppError("Invalid credentials", 401)
    }


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
    await handleOtp(mobile);


    const user = await User.create({
      name,
      mobile,
      password,
      username,
      hashPassword,
    })

    res.status(201).json(formatResponse(true,'Created successfully' , {user}));


  } catch (error) {
    console.log("Error at registerUser");
    handleError(error, res);

  }
}
