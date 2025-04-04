import {IGoalLevel} from "@/types/user";

export interface IBuddyRequest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
    goal: {
      title: string;
      target: string;
      year: number;
      level: IGoalLevel;
    };
    interests: string[];
  };
  receiver: string;
  type: 'buddy' | 'follower';
  status: 'pending' | 'accepted' | 'rejected';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}