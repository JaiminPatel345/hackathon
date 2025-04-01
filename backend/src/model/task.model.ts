import mongoose, {Schema} from 'mongoose';
import {ITask, TaskCategory} from "../types/task.type.js";


const taskSchema: Schema = new Schema<ITask>({
  content: {
    type: String,
    required: true
  },
  isDoneByMe: {
    type: Boolean,
    default: false
  },
  isDoneByBuddy: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(TaskCategory)
  },
  finishDate: {
    type: Date,
    // default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    required: true
  },
  participants: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true,
    validate: {
      validator: function (v: mongoose.Types.ObjectId[]) {
        return v.length === 1 || v.length === 2; // Must have 1 or 2 participants
      },
      message: 'Tasks must have either 1 or 2 participants'
    }
  },
  progress:{
    type:String,
  }
}, {
  timestamps: true
});

// Add index for efficient queries
taskSchema.index({participants: 1, isDeleted: 1});
taskSchema.index({category: 1});

export const Task = mongoose.model<ITask>('Task', taskSchema);