import {Request, Response} from 'express';
import mongoose from "mongoose";
import {Task} from "../model/task.model.js";
import {AppError, formatResponse} from "../types/custom.types.js";
import handleError from "../utiles/handleError.js";
import {
  ICreateTaskRequest,
  IToggleTaskStatusRequest,
  IUpdateTaskRequest
} from "../types/request.types.js";
import {
  getUserFromRequest,
  validateTaskParticipant
} from "../utiles/userHelper.js";

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      content,
      category,
      finishDate,
      isPrivate,

      progress
    }: ICreateTaskRequest = req.body;

    const user = await getUserFromRequest(req);
    const userId = user._id;
    const participants = [userId];
    const buddyId = user.buddy;

    // Add buddy if specified and validate buddy exists
    if (!isPrivate) {
      participants.push(buddyId);
    }

    const newTask = new Task({
      content,
      category,
      isPrivate,
      participants,
      ...(finishDate && {finishDate}),
      ...(progress && {progress})
    });

    await newTask.save();

    res.status(201).json(formatResponse(true, "Task created successfully", newTask));
    return;

  } catch (error) {
    console.log("Error creating task");
    handleError(error, res);
  }
};

// Get user tasks (including buddy tasks)
export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    const userId = user._id;
    const {category, isDeleted = false} = req.query;

    const query: any = {
      participants: userId,
      isDeleted: isDeleted === 'true'
    };

    if (category) {
      query.category = category;
    }

    const tasks = await Task.find(query)
        .sort({createdAt: -1})
        .populate('participants', 'username avatar');

    res.json(formatResponse(true, "Tasks retrieved successfully", tasks));
    return;

  } catch (error) {
    console.log("Error fetching tasks");
    handleError(error, res);
  }
};

// Update task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const {
      taskId,
      content,
      category,
      finishDate,
      isPrivate,
      progress
    }: IUpdateTaskRequest = req.body;

    const user = await getUserFromRequest(req);
    const userId = user._id;

    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // Ensure user is a participant
    validateTaskParticipant(task, userId);

    // Update fields if provided
    if (content !== undefined) task.content = content;
    if (category !== undefined) task.category = category;
    if (finishDate !== undefined) task.finishDate = finishDate;
    if (isPrivate !== undefined) task.isPrivate = isPrivate;
    if (progress !== undefined) task.progress = progress;

    await task.save();

    res.json(formatResponse(true, "Task updated successfully", task));
    return;

  } catch (error) {
    console.log("Error updating task");
    handleError(error, res);
  }
};

// Toggle task completion status for the user
export const toggleTaskStatus = async (req: Request, res: Response) => {
  try {
    const {taskId}: IToggleTaskStatusRequest = req.body;

    const user = await getUserFromRequest(req);
    const userId = user._id;

    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // Ensure user is a participant
    validateTaskParticipant(task, userId);

    // Determine if the user is the owner or buddy
    const isOwner = task.participants[0].toString() === userId.toString();

    // Toggle appropriate status
    if (isOwner) {
      task.isDoneByMe = !task.isDoneByMe;
    } else {
      task.isDoneByBuddy = !task.isDoneByBuddy;
    }

    await task.save();

    res.json(formatResponse(true, "Task status updated", task));
    return;

  } catch (error) {
    console.log("Error toggling task status");
    handleError(error, res);
  }
};

// Soft delete task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const {taskId} = req.params;

    const user = await getUserFromRequest(req);
    const userId = user._id;

    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // Ensure user is a participant
    validateTaskParticipant(task, userId);

    // Soft delete
    task.isDeleted = true;
    await task.save();

    res.json(formatResponse(true, "Task deleted successfully", null));
    return;

  } catch (error) {
    console.log("Error deleting task");
    handleError(error, res);
  }
};

// Get tasks with buddy
export const getBuddyTasks = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    const userId = user._id;
    const {buddyId} = req.params;

    if (!buddyId) {
      throw new AppError("Buddy ID is required", 400);
    }

    const tasks = await Task.find({
      participants: {$all: [userId, new mongoose.Types.ObjectId(buddyId)]},
      isDeleted: false
    }).populate('participants', 'username avatar');

    res.json(formatResponse(true, "Buddy tasks retrieved successfully", tasks));
    return;

  } catch (error) {
    console.log("Error fetching buddy tasks");
    handleError(error, res);
  }
};
