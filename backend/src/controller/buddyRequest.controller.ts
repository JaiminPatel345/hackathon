import {Request, Response} from 'express';
import BuddyRequest from '../model/buddyRequest.model.js';
import User from '../model/user.model.js';
import {AppError, formatResponse} from "../types/custom.types.js";
import handleError from "../utiles/handleError.js";
import {
  getUserFromRequest,
  validateNotSelf,
  validateRequestForBuddy,
  validateUserExists,
  validateUserNotBlocked
} from "../utiles/userHelper.js";
import mongoose from "mongoose";

// Send a buddy request
export const sendBuddyRequest = async (req: Request, res: Response) => {
  try {
    const {userId, type} = req.body; // type can be 'buddy' or 'follower'

    // Get current user
    const currentUser = await getUserFromRequest(req);

    // Check if target user exists
    const receiverUser = await validateUserExists(userId);

    // Validate not trying to send request to self
    validateNotSelf(currentUser._id, userId);

    // Check if target user is not blocked
    validateUserNotBlocked(currentUser, userId);

    if(receiverUser.buddy){
      throw new AppError("Receiver already have buddy",400);
    }

    if (receiverUser.blockedUsers.some(
        (blockedId: mongoose.Types.ObjectId) => blockedId.toString() === currentUser._id.toString()
    )) {
      res.status(400).json(formatResponse(false, "Cannot send request to this user"));
      return;
    }

    // If this is a primary buddy request, check if sender already has a buddy
    if (type === 'buddy' && currentUser.buddy) {
      res.status(400).json(formatResponse(false, "You already have a primary buddy. Please remove your current buddy first."));
      return;
    }

    // Check if there's already a pending request
    const existingRequest = await BuddyRequest.findOne({
      sender: currentUser._id,
      receiver: userId,
      type,
      status: 'pending'
    });

    if (existingRequest) {
      res.status(400).json(formatResponse(false, "A request is already pending"));
      return;
    }

    // Find and update any existing request regardless of status, or create a new one
    const buddyRequest = await BuddyRequest.findOneAndUpdate(
      {
        sender: currentUser._id,
        receiver: userId,
        type
      },
      {
        $set: {
          status: 'pending',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    res.status(201).json(formatResponse(true, "Request sent successfully", {request: buddyRequest}));

  } catch (error) {
    console.log("Error sending buddy request");
    handleError(error, res);
  }
};

// Accept buddy request
export const acceptBuddyRequest = async (req: Request, res: Response) => {
  try {
    const {requestId} = req.body;

    const currentUser = await getUserFromRequest(req);

    const buddyRequest = await validateRequestForBuddy(requestId);

    // Ensure the current user is the receiver
    if (buddyRequest.receiver.toString() !== currentUser._id.toString()) {
      res.status(403).json(formatResponse(false, "Not authorized to accept this request"));
      return;
    }

    // Check if request is expired
    if (new Date() > new Date(buddyRequest.expiresAt)) {
      await BuddyRequest.findByIdAndDelete(requestId);
      res.status(400).json(formatResponse(false, "Request has expired"));
      return;
    }

    // Process based on request type
    if (buddyRequest.type === 'buddy') {
      // Handle buddy request (primary buddy)

      // Check if receiver already has a buddy
      if (currentUser.buddy) {
        res.status(400).json(formatResponse(false, "You already have a primary buddy. Please remove your current buddy first."));
        return;
      }

      const senderUser = await validateUserExists(buddyRequest.sender);

      if (senderUser.buddy) {
        buddyRequest.status = 'rejected';
        await buddyRequest.save();
        res.status(400).json(formatResponse(false, "The sender already has a primary buddy."));
        return;
      }

      // Update sender's buddy
      await User.findByIdAndUpdate(buddyRequest.sender, {
        $set: {buddy: currentUser._id}
      });

      // Update receiver's buddy
      await User.findByIdAndUpdate(currentUser._id, {
        $set: {buddy: buddyRequest.sender}
      });

    } else {
      // Handle follower request (add to buddies)
      await User.findByIdAndUpdate(buddyRequest.sender, {
        $addToSet: {buddies: currentUser._id}
      });

      // Optionally add receiver to sender's buddies (mutual following)
      await User.findByIdAndUpdate(currentUser._id, {
        $addToSet: {buddies: buddyRequest.sender}
      });
    }

    // Update request status
    buddyRequest.status = 'accepted';
    await buddyRequest.save();

    res.status(200).json(formatResponse(true, "Request accepted successfully"));

  } catch (error) {
    console.log("Error accepting buddy request");
    handleError(error, res);
  }
};

// Reject buddy request
export const rejectBuddyRequest = async (req: Request, res: Response) => {
  try {
    const {requestId} = req.body;

    // Get current user
    const currentUser = await getUserFromRequest(req);

    // Find the request
    const buddyRequest = await BuddyRequest.findById(requestId);

    if (!buddyRequest) {
      res.status(404).json(formatResponse(false, "Request not found"));
      return;
    }

    if (buddyRequest.status === 'rejected' || buddyRequest.status === 'accepted') {
      res.status(429).json(formatResponse(false, "Request has expired"));
    }

    // Ensure the current user is the receiver
    if (buddyRequest.receiver.toString() !== currentUser._id.toString()) {
      res.status(403).json(formatResponse(false, "Not authorized to reject this request"));
      return;
    }

    // Update request status
    buddyRequest.status = 'rejected';
    await buddyRequest.save();

    res.status(200).json(formatResponse(true, "Request rejected successfully"));

  } catch (error) {
    console.log("Error rejecting buddy request");
    handleError(error, res);
  }
};

// Cancel sent buddy request
export const cancelBuddyRequest = async (req: Request, res: Response) => {
  try {
    const {requestId} = req.body;

    // Get current user
    const currentUser = await getUserFromRequest(req);

    // Find the request
    const buddyRequest = await BuddyRequest.findById(requestId);

    if (!buddyRequest) {
      res.status(404).json(formatResponse(false, "Request not found"));
      return;
    }

    // Ensure the current user is the sender
    if (buddyRequest.sender.toString() !== currentUser._id.toString()) {
      res.status(403).json(formatResponse(false, "Not authorized to cancel this request"));
      return;
    }

    // Delete the request
    await BuddyRequest.findByIdAndDelete(requestId);

    res.status(200).json(formatResponse(true, "Request cancelled successfully"));

  } catch (error) {
    console.log("Error cancelling buddy request");
    handleError(error, res);
  }
};

// Get pending buddy requests sent by user
export const getSentRequests = async (req: Request, res: Response) => {
  try {
    const currentUser = await getUserFromRequest(req);

    const requests = await BuddyRequest.find({
      sender: currentUser._id,
      status: 'pending'
    })
        .populate('receiver', '-hashPassword')
        .sort('-createdAt');

    res.status(200).json(formatResponse(true, "Sent requests retrieved successfully", {requests}));

  } catch (error) {
    console.log("Error retrieving sent requests");
    handleError(error, res);
  }
};

// Get pending buddy requests received by user
export const getReceivedRequests = async (req: Request, res: Response) => {
  try {
    const currentUser = await getUserFromRequest(req);

    const requests = await BuddyRequest.find({
      receiver: currentUser._id,
      status: 'pending'
    })
        .populate('sender', '-hashPassword')
        .sort('-createdAt');

    // Filter out expired requests
    const validRequests = requests.filter(request => new Date() <= new Date(request.expiresAt));

    // Delete expired requests
    const expiredRequestIds = requests
        .filter(request => new Date() > new Date(request.expiresAt))
        .map(request => request._id);

    if (expiredRequestIds.length > 0) {
      await BuddyRequest.deleteMany({_id: {$in: expiredRequestIds}});
    }

    res.status(200).json(formatResponse(true, "Received requests retrieved successfully", {requests: validRequests}));

  } catch (error) {
    console.log("Error retrieving received requests");
    handleError(error, res);
  }
};
