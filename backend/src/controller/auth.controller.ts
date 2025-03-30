import {Request, Response} from "express";
import {AppError, formatResponse} from "../types/custom.types.js";
import {ILoginRequest} from "../types/request.types.js";
import User from "../model/user.model.js";
import {verifyPassword} from "../utiles/hashPassword.js";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {identifier, password}: ILoginRequest = req.body;
    let hasMobile = false;
    if (identifier.includes('+')) {
      hasMobile = true;
    }

    const user =await User.findOne(hasMobile ? {mobile: identifier} : {username: identifier}).lean()
    if(!user){
      console.log("User not found");
      throw new AppError("Invalid credentials" , 401)
    }

    if(!verifyPassword(password , user.hashPassword)){
      console.log("Wrong Password");
      throw new AppError("Invalid credentials" , 401)
    }



  } catch (err: any) {
    console.log("Error at login user", err);
    res.status(err.statusCode || 500).json(formatResponse(false, err.message || "Unknown error", {err}));
  }
}
