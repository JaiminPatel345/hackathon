export interface IUser {
  _id: string;
  name: string;
  username: string;
  email?: string;
  mobile: string;
  goal: {
    title: string;
    target: string;
    year: number;
    level: IGoalLevel;
  };
  interests: string[];
  buddy: string | null;
  buddies: string[];
  blockedUsers: string[];
  pvsBuddy: string[];
  avatar: string;
  isMobileVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
  communities: string[];
  lastActive?: string;
  status?: string;
  conversations: string[];
}

export enum IGoalLevel {
  EXPERT = 'EXPERT',
  INTERMEDIATE = 'INTERMEDIATE',
  BEGINNER = 'BEGINNER',
}