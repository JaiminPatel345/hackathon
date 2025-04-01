//---------- User -----------
import {TaskCategory} from "./task.type.js";

export interface ILoginRequest {
  identifier: string,
  password: string,
}

export interface IRegisterRequest {
  name: string,
  username: string,
  password: string,
  mobile: string,
}

export interface IVerifyOtpRequest {
  username: string,
  givenOtp: string,
}


//------------Task
export interface ICreateTaskRequest {
  content: string;
  category: TaskCategory;
  finishDate?: Date;
  isPrivate: boolean;
  buddyId?: string;
  progress?: string;
}

export interface IUpdateTaskRequest {
  taskId: string;
  content?: string;
  category?: TaskCategory;
  finishDate?: Date;
  isPrivate?: boolean;
  progress?: string;
}

export interface IToggleTaskStatusRequest {
  taskId: string;
}