export enum TaskCategory {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export interface ITask {
  _id: string;
  content: string;
  isDoneByMe: boolean;
  isDoneByBuddy: boolean;
  category: TaskCategory;
  finishDate?: string;
  isDeleted: boolean;
  isPrivate: boolean;
  participants: string[];
  progressOfMe?: string;
  progressOfBuddy?: string;
  createdAt: string;
  updatedAt: string;
}