import mongoose from 'mongoose';
import {IGoalLevel, IUser} from "../types/user.types.js";

const Schema = mongoose.Schema;

// Enhanced User Schema with chat-related fields
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
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
    trim: true
  },
  goal: {
    title: {type: String, trim: true},
    target: {type: String, trim: true},
    year: {type: Number},
    level: {
      type: String,
      enum: Object.values(IGoalLevel),
    },
  },
  interests: [{
    type: String,
    trim: true
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
  isActive: {
    type: Boolean,
    default: true
  },
  communities: [{
    type: mongoose.Types.ObjectId,
    ref: 'Conversation',
  }],
  lastActive: {
    type: Date,
    default: Date.now
  },
  status: {
    message: {
      type: String,
      trim: true,
      default: ''
    },
    emoji: {
      type: String,
      default: ''
    }
  },
  conversations: [{
    type: mongoose.Types.ObjectId,
    ref: 'Conversation'
  }]
}, {
  timestamps: true,
});

UserSchema.index({isActive: 1});

const User: mongoose.Model<IUser> = mongoose.model('User', UserSchema);
export default User;