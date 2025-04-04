export enum IConversationType {
  PERSONAL = 'personal',
  COMMUNITY = 'community',
}

export interface IConversation {
  _id: string;
  title?: string;
  description?: string;
  type: IConversationType;
  participants: {
    _id: string;
    username: string;
    avatar: string;
  }[];
  lastMessage?: string;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export const IMessageType = {
  TEXT: 'text',
  RESOURCE: 'resource',
  MEETING: 'meeting',
} as const;

export type MessageType = typeof IMessageType[keyof typeof IMessageType];

export interface IMessage {
  _id: string;
  conversation: string;
  sender: string;
  type: MessageType;
  content?: string;
  resources?: string[];
  replyTo?: string;
  deletedFor: string[];
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}