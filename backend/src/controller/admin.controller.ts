//----------Admin Only ---------------
import {Request, Response} from "express";
import User from "../model/user.model.js";
import {formatResponse} from "../types/custom.types.js";
import handleError from "../utiles/handleError.js";

export const adminMakeBuddy = async (req: Request, res: Response) => {
  try {
    const {user1Id, user2Id} = req.body;

    // Validate both users exist
    const user1 = await User.findById(user1Id);
    if (!user1) {
      res.status(404).json(formatResponse(false, `User with ID ${user1Id} not found`));
      return;
    }

    const user2 = await User.findById(user2Id);
    if (!user2) {
      res.status(404).json(formatResponse(false, `User with ID ${user2Id} not found`));
      return;
    }

    // Move current buddies to pvsBuddy list if they exist
    if (user1.buddy) {
      if (!user1.pvsBuddy.includes(user1.buddy)) {
        await User.findByIdAndUpdate(user1Id, {
          $push: {pvsBuddy: user1.buddy}
        });
      }
    }

    if (user2.buddy) {
      if (!user2.pvsBuddy.includes(user2.buddy)) {
        await User.findByIdAndUpdate(user2Id, {
          $push: {pvsBuddy: user2.buddy}
        });
      }
    }

    // Update both users to be each other's primary buddy
    await User.findByIdAndUpdate(user1Id, {
      $set: {buddy: user2Id}
    });

    await User.findByIdAndUpdate(user2Id, {
      $set: {buddy: user1Id}
    });

    res.status(200).json(formatResponse(true, "Users successfully set as primary buddies"));
    return;

  } catch (error) {
    console.log("Error in adminMakeBuddy");
    handleError(error, res);
  }
};

// Super Admin: Remove buddy relationship between two users
export const adminRemoveBuddy = async (req: Request, res: Response) => {
  try {
    const {userId} = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json(formatResponse(false, `User with ID ${userId} not found`));
      return;
    }

    // Check if user has a buddy
    if (!user.buddy) {
      res.status(400).json(formatResponse(false, "User does not have a primary buddy"));
      return;
    }

    const buddyId = user.buddy;

    // Get buddy user
    const buddyUser = await User.findById(buddyId);
    if (buddyUser && buddyUser.buddy && buddyUser.buddy.toString() === userId) {
      // Move to previous buddies if not already there
      if (!buddyUser.pvsBuddy.includes(userId)) {
        await User.findByIdAndUpdate(buddyId, {
          $push: {pvsBuddy: userId},
          $set: {buddy: null}
        });
      } else {
        await User.findByIdAndUpdate(buddyId, {
          $set: {buddy: null}
        });
      }
    }

    // Move to previous buddies if not already there for original user
    if (!user.pvsBuddy.includes(buddyId)) {
      await User.findByIdAndUpdate(userId, {
        $push: {pvsBuddy: buddyId},
        $set: {buddy: null}
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $set: {buddy: null}
      });
    }

    res.status(200).json(formatResponse(true, "Buddy relationship successfully removed", {
      userId,
      removedBuddyId: buddyId
    }));
    return;

  } catch (error) {
    console.log("Error in adminRemoveBuddy");
    handleError(error, res);
  }
};

// Super Admin: Add user as a follower (buddies list) to another user
export const adminAddToBuddies = async (req: Request, res: Response) => {
  try {
    const {user1Id, user2Id, mutual = true} = req.body;

    // Validate both users exist
    const user1 = await User.findById(user1Id);
    if (!user1) {
      res.status(404).json(formatResponse(false, `User with ID ${user1Id} not found`));
      return;
    }

    const user2 = await User.findById(user2Id);
    if (!user2) {
      res.status(404).json(formatResponse(false, `User with ID ${user2Id} not found`));
      return;
    }

    // Add user2 to user1's buddies list
    await User.findByIdAndUpdate(user1Id, {
      $addToSet: {buddies: user2Id}
    });

    // If mutual is true, also add user1 to user2's buddies list
    if (mutual) {
      await User.findByIdAndUpdate(user2Id, {
        $addToSet: {buddies: user1Id}
      });
    }

    res.status(200).json(formatResponse(true, `User relationship${mutual ? ' mutually' : ''} added to buddies list`, {
      user1: user1Id,
      user2: user2Id,
      mutual
    }));
    return;

  } catch (error) {
    console.log("Error in adminAddToBuddies");
    handleError(error, res);
  }
};

// Super Admin: Remove user from another user's buddies list
export const adminRemoveFromBuddies = async (req: Request, res: Response) => {
  try {
    const {user1Id, user2Id, mutual = true} = req.body;

    // Validate both users exist
    const user1 = await User.findById(user1Id);
    if (!user1) {
      res.status(404).json(formatResponse(false, `User with ID ${user1Id} not found`));
      return;
    }

    const user2 = await User.findById(user2Id);
    if (!user2) {
      res.status(404).json(formatResponse(false, `User with ID ${user2Id} not found`));
      return;
    }

    // Remove user2 from user1's buddies list
    await User.findByIdAndUpdate(user1Id, {
      $pull: {buddies: user2Id}
    });

    // If mutual is true, also remove user1 from user2's buddies list
    if (mutual) {
      await User.findByIdAndUpdate(user2Id, {
        $pull: {buddies: user1Id}
      });
    }

    res.status(200).json(formatResponse(true, `User${mutual ? ' mutually' : ''} removed from buddies list`, {
      user1: user1Id,
      user2: user2Id,
      mutual
    }));
    return;

  } catch (error) {
    console.log("Error in adminRemoveFromBuddies");
    handleError(error, res);
  }
};
