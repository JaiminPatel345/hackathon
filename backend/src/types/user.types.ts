import mongoose from "mongoose";

export interface IUser {
  name: string;
  username: string;
  hashPassword: string;
  email: string;
  mobile: string;
  goal: {
    title: string;
    target: string;
    year: number;
    level: number;
  };
  interests: string[];
  buddy:mongoose.Types.ObjectId;
  buddies:mongoose.Types.ObjectId[];
  blockedUsers:mongoose.Types.ObjectId[];
  pvsBuddy:mongoose.Types.ObjectId[];
  profile:{
    url: string;
    public_id: string;
  };
  isMobileVerified: boolean;
}