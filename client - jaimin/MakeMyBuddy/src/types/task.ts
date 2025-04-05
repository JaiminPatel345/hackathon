export enum TaskCategory {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface ITask {
  _id: string;
  content: string;
  description?: string;
  isDoneByMe: boolean;
  isDoneByBuddy: boolean;
  category: TaskCategory;
  finishDate?: string;
  dueDate?: string;
  priority?: TaskPriority;
  isDeleted: boolean;
  isPrivate: boolean;
  participants: string[];
  progressOfMe?: string;
  progressOfBuddy?: string;
  createdAt: string;
  updatedAt: string;
}