export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedBy?: string; // User ID
  createdBy: string;    // User ID
  assignedTo: string[]; // Array of User IDs
  createdAt: string;
  updatedAt: string;
}