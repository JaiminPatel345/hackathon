import mongoose, {Document} from "mongoose";

export enum TaskCategory {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export interface ITask extends Document {
  content: string;
  isDoneByMe: boolean;
  isDoneByBuddy: boolean;
  category: TaskCategory;
  finishDate: Date;
  isDeleted: boolean;
  isPrivate: boolean;
  participants: mongoose.Types.ObjectId[];
  progress:string;
  createdAt: Date;
  updatedAt: Date;
}

