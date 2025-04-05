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

// Remove current buddy (moves to previous buddies)
export const removeBuddy = async (req: Request, res: Response) => {
  try {
    // Get current user
    const currentUser = await getUserFromRequest(req);

    if (!currentUser) {
      res.status(401).json(formatResponse(false, "Authentication required"));
      return;
    }

    // Check if the user has a buddy
    if (!currentUser.buddy) {
      res.status(400).json(formatResponse(false, "You don't have a buddy to remove"));
      return;
    }

    // Store current buddy ID before removing
    const currentBuddyId = currentUser.buddy;

    // Update current user: move buddy to pvsBuddy and remove from buddy
    await User.findByIdAndUpdate(
        currentUser._id,
        {
          $addToSet: {pvsBuddy: currentBuddyId},
          $set: {buddy: null}
        }
    );

    const buddyUser = await User.findById(currentBuddyId);
    if (buddyUser && buddyUser.buddy) {
      await User.findByIdAndUpdate(
          currentBuddyId,
          {
            $addToSet: {pvsBuddy: currentUser._id}, // Add to previous buddies
            $set: {buddy: null} // Remove current buddy
          }
      );
    }

    res.status(200).json(formatResponse(true, "Buddy removed successfully"));
    return;

  } catch (error) {
    console.log("Error removing buddy");
    handleError(error, res);
  }
};

// Remove a user from buddies list
export const removeFromBuddies = async (req: Request, res: Response) => {
  try {
    const {userId} = req.body;

    if (!userId) {
      res.status(400).json(formatResponse(false, "User ID is required"));
      return;
    }

    const currentUser = await getUserFromRequest(req);

    await validateUserExists(userId);

    const isBuddy = currentUser.buddies.some(
        (buddyId: mongoose.Types.ObjectId) => buddyId.toString() === userId.toString()
    );

    if (!isBuddy) {
      res.status(400).json(formatResponse(false, "User is not in your buddies list"));
      return;
    }

    await User.findByIdAndUpdate(
        currentUser._id,
        {
          $pull: {buddies: userId}
        }
    );

    await User.findByIdAndUpdate(
        userId,
        {
          $pull: {buddies: currentUser._id}
        }
    );

    res.status(200).json(formatResponse(true, "User removed from buddies successfully"));
    return;

  } catch (error) {
    console.log("Error removing user from buddies");
    handleError(error, res);
  }
};

export const suggestBuddies = async (req: Request, res: Response) => {
  try {
    const currentUser = await getUserFromRequest(req);

    const excludeUserIds = [
      currentUser._id,
      ...(currentUser.buddy ? [currentUser.buddy] : []), //if have buddy
      ...currentUser.blockedUsers,
      ...currentUser.pvsBuddy,
      ...currentUser.buddies
    ];

    const goalMatchCriteria: any = {};

    if (currentUser.goal) {

      if (currentUser.goal.title) {
        goalMatchCriteria['goal.title'] = currentUser.goal.title;
      }

      if (currentUser.goal.target) {
        goalMatchCriteria['goal.target'] = currentUser.goal.target;
      }

      if (currentUser.goal.year) {
        goalMatchCriteria['goal.year'] = currentUser.goal.year;
      }

      if (currentUser.goal.level) {
        goalMatchCriteria['goal.level'] = currentUser.goal.level;
      }
    }

    // Get communities the user has joined
    const userCommunities = await mongoose.model('Community').find({
      members: currentUser._id
    }).select('_id');

    const communityIds = userCommunities.map(community => community._id);

    // First query: Find users with exact goal match
    const exactGoalMatches = await User.find({
      _id: {$nin: excludeUserIds},
      ...goalMatchCriteria,
      buddy: null // Only suggest users who don't have a buddy yet
    })
        .select('-hashPassword')
        .limit(10);

    // Second query: Find users in same communities
    const communityMatches = await User.find({
      _id: {$nin: [...excludeUserIds, ...exactGoalMatches.map(user => user._id)]},
      communities: {$in: communityIds},
      buddy: null // who don't have a buddy yet
    })
        .select('-hashPassword')
        .limit(10);

    const partialGoalCriteria: any = {};

    if (currentUser.goal) {
      if (currentUser.goal.title) {
        // Use regex for partial title match
        partialGoalCriteria['goal.title'] = {
          $regex: new RegExp(currentUser.goal.title.split(' ').join('|'), 'i')
        };
      }

      if (currentUser.goal.year) {
        partialGoalCriteria['goal.year'] = {
          $gte: currentUser.goal.year - 1,
          $lte: currentUser.goal.year + 1
        };
      }
    }

    const partialGoalMatches = await User.find({
      _id: {
        $nin: [...excludeUserIds,
          ...exactGoalMatches.map(user => user._id),
          ...communityMatches.map(user => user._id)]
      },
      ...partialGoalCriteria,
      buddy: null
    })
        .select('-hashPassword')
        .limit(10);

    // Calculate match score for all potential buddies
    const calculateMatchScore = (user: any) => {
      let score = 0;

      if (user.goal && currentUser.goal) {
        if (user.goal.title === currentUser.goal.title) score += 50;
        if (user.goal.target === currentUser.goal.target) score += 20;
        if (user.goal.year === currentUser.goal.year) score += 20;
        if (user.goal.level === currentUser.goal.level) score += 10;
      }

      if (user.interests && currentUser.interests) {
        const commonInterests = user.interests.filter((interest: string) =>
            currentUser.interests.includes(interest)
        );
        score += commonInterests.length * 5;
      }

      return score;
    };

    // Combine all matches and sort by score
    const allPotentialBuddies = [
      ...exactGoalMatches,
      ...communityMatches,
      ...partialGoalMatches
    ];

    const scoredBuddies = allPotentialBuddies.map(user => ({
      user,
      score: calculateMatchScore(user)
    }));

    // Sort by score descending
    scoredBuddies.sort((a, b) => b.score - a.score);

    // Extract top 20 recommendations
    const recommendations = scoredBuddies.slice(0, 20).map(item => item.user);

    res.status(200).json(formatResponse(true, "Buddy suggestions retrieved successfully", {
      recommendations
    }));
    return;

  } catch (error) {
    handleError(error, res, "Error suggesting buddy");
  }
};