import {Request, Response} from 'express';
import User from '../model/user.model.js';
import {formatResponse} from "../types/custom.types.js";
import handleError from "../utiles/handleError.js";
import {
  getUserFromRequest,
  validateNotSelf,
  validateUserExists
} from "../utiles/userHelper.js";
import mongoose from "mongoose";
import {UserQuery} from "../types/user.types.js";


const getUserProfileFromQuery = async (req: Request, res: Response, query: UserQuery) => {
  try {

    const user = await User.findOne(query)
        .select('-hashPassword')
        .populate('buddy', '-hashPassword')
        .populate('buddies', '-hashPassword')
        .populate('pvsBuddy', '-hashPassword')
        .populate('blockedUsers', '-hashPassword');

    if (!user) {
      res.status(404).json(formatResponse(false, "User not found"));
      return;
    }

    res.status(200).json(formatResponse(true, "User profile retrieved successfully", {user}));
    return;

  } catch (error) {
    console.log("Error retrieving user profile");
    handleError(error, res);
  }
};

export const getMyProfile = async (req: Request, res: Response) => {
  const username = req.username;

  if (!username) {
    res.status(401).json(formatResponse(false, "Authentication required"));
    return;
  }

  await getUserProfileFromQuery(req, res, {username})
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    res.status(401).json(formatResponse(false, "User Id not found"));
    return;
  }

  await getUserProfileFromQuery(req, res, {_id: userId})
};

// Update user details (reusing the existing controller)
export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const username = req.username;

    if (!username) {
      res.status(401).json(formatResponse(false, "Authentication required"));
      return;
    }

    // Fields that can be updated
    const {interests, goal, avatar, name} = req.body;

    // Build update object with only the fields that are provided
    const updateData: any = {};

    if (interests !== undefined) updateData.interests = interests;
    if (goal !== undefined) updateData.goal = goal;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (name !== undefined) updateData.name = name;

    // Find user by username and update
    const updatedUser = await User.findOneAndUpdate(
        {username},
        updateData,
        {new: true, runValidators: true}
    ).select('-hashPassword');

    if (!updatedUser) {
      res.status(404).json(formatResponse(false, "User not found"));
      return;
    }

    res.status(200).json(formatResponse(true, "User updated successfully", {user: updatedUser}));
    return;

  } catch (error) {
    console.log("Error at updateUserDetails");
    handleError(error, res);
  }
};

// Toggle block status for a user
export const toggleBlockUser = async (req: Request, res: Response) => {
  try {
    const {userId} = req.body;

    // Get current user
    const currentUser = await getUserFromRequest(req);

    // Validate target user exists
    await validateUserExists(userId);

    // Validate not trying to block self
    validateNotSelf(currentUser._id, userId);

    // Check if user is already blocked
    const isBlocked = currentUser.blockedUsers.some(
        (blockedId: mongoose.Types.ObjectId) => blockedId.toString() === userId.toString()
    );

    if (isBlocked) {
      // Unblock user
      currentUser.blockedUsers = currentUser.blockedUsers.filter(
          (blockedId: mongoose.Types.ObjectId) => blockedId.toString() !== userId.toString()
      );

      await currentUser.save();
      res.status(200).json(formatResponse(true, "User unblocked successfully"));
      return;
    } else {
      // Block user
      currentUser.blockedUsers.push(userId);

      // If blocked user is the current buddy, remove them
      if (currentUser.buddy && currentUser.buddy.toString() === userId.toString()) {
        // Move to previous buddies if not already there
        if (!currentUser.pvsBuddy.includes(currentUser.buddy)) {
          currentUser.pvsBuddy.push(currentUser.buddy);
        }
        currentUser.buddy = null;
      }

      // Remove from buddies list if present
      currentUser.buddies = currentUser.buddies.filter(
          (buddyId: mongoose.Types.ObjectId) => buddyId.toString() !== userId.toString()
      );

      await currentUser.save();
      res.status(200).json(formatResponse(true, "User blocked successfully"));
      return;
    }

  } catch (error) {
    console.log("Error toggling block status");
    handleError(error, res);
  }
};

