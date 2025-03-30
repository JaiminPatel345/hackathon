import mongoose from 'mongoose';
import {IUser} from "../types/user.types.js";

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
  hashPassword:{
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  }
})

const User = mongoose.model('User', UserSchema);
export default User;
