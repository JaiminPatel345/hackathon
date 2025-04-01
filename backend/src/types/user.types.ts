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
    level: IGoalLevel;
  };
  interests: string[];
  buddy:mongoose.Types.ObjectId | null;
  buddies:mongoose.Types.ObjectId[];
  blockedUsers:mongoose.Types.ObjectId[];
  pvsBuddy:mongoose.Types.ObjectId[];
  avatar:string;
  isMobileVerified: boolean;
  isActive:boolean;
  isAdmin:boolean;
}

export enum IGoalLevel {
  EXPERT = "EXPERT",        // Very skilled and experienced
  INTERMEDIATE = "INTERMEDIATE", // Decent skill but still learning
  BEGINNER = "BEGINNER",    // Just starting out
}

export interface UserQuery {
  username?: string;
  _id?: string;
  [key: string]: any; // For any other potential query params
}