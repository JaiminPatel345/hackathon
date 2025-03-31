import mongoose from 'mongoose';
import {IGoalLevel, IUser} from "../types/user.types.js";

const Schema = mongoose.Schema

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
  },
  hashPassword: {
    type: String,
    required: true,
    select: false,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  goal: {
    title: {type: String},
    target: {type: String},
    year: {type: Number},
    level: {
      type: String,
      enum: Object.values(IGoalLevel),
    },
  },
  interests: [{
    type: String
  }],
  buddy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  buddies: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }],
  blockedUsers: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }],
  pvsBuddy: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }],
  avatar: {
    type: String,
    default: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },


}, {
  timestamps: true,
})

const User: mongoose.Model<IUser> = mongoose.model('User', UserSchema);
export default User;
