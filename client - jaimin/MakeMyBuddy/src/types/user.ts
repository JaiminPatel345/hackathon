export interface UserGoal {
  title: string;       // E.g. "JEE Main"
  target: string;      // E.g. "Rank under 3 digits"
  year: string;        // E.g. "2027"
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  goal?: UserGoal;
  createdAt: string;
  updatedAt: string;
}

export interface BuddyRequest {
  id: string;
  from: User;
  to: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}