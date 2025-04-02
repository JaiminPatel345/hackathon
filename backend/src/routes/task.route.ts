// routes/task.routes.ts
import express from 'express';
import {isAuthenticated} from "../utiles/verifyRequest/isAuthenticated.js";
import * as taskController from '../controller/task.controller.js'
import {verifyTaskRequest} from "../utiles/verifyRequest/taskRequest.js";


const router = express.Router();

// Create a new task
router.post('/', isAuthenticated, verifyTaskRequest, taskController.createTask);

// Get user tasks
router.get('/', isAuthenticated, taskController.getUserTasks);

// Update task , progress
router.put('/', isAuthenticated, taskController.updateTask);

// Toggle task status (mark as done)
router.put('/toggle-status', isAuthenticated, taskController.toggleTaskStatus);

// Soft delete task
router.delete('/:taskId', isAuthenticated, taskController.deleteTask);

// Get tasks with specific buddy
router.get('/buddy/:buddyId', isAuthenticated, taskController.getBuddyTasks);


export default router;
