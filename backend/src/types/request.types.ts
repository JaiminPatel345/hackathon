//---------- User -----------
import {TaskCategory} from "./task.type.js";
import {IConversationType} from "./conversation.types.js";
import {IMessageType} from "./message.types.js";

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


//------------Task-------------
export interface ICreateTaskRequest {
  content: string;
  category: TaskCategory;
  finishDate?: Date;
  isPrivate: boolean;
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


//-----------Chat---------------
export interface ICreateConversationRequest {
  title?: string;
  description?: string;
  type: typeof IConversationType[keyof typeof IConversationType];
  participants: string[];
}

export interface IUpdateConversationRequest {
  conversationId: string;
  title?: string;
  description?: string;
}

export interface ISendMessageRequest {
  conversationId: string;
  content: string;
  type?: typeof IMessageType[keyof typeof IMessageType];
  replyTo?: string;
}

export interface IEditMessageRequest {
  messageId: string;
  content: string;
}

export interface IMarkAsReadRequest {
  conversationId: string;
}