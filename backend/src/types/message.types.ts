import mongoose from "mongoose";

export enum IMessageType  {
  TEXT= "text",
  RESOURCE= "resource",
  MEETING= "meeting",
}


export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: typeof IMessageType[keyof typeof IMessageType];
  content?: string;
  resources?: mongoose.Types.ObjectId[];
  replyTo?: mongoose.Types.ObjectId;
  deletedFor: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  isEdited: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  softDelete(): Promise<IMessage>;
  editMessage(newContent: string): Promise<IMessage>;
}

export enum IResourceType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
  DOCUMENT = 'document',
  LINK = 'link',
  OTHER = 'other'
}

export type IResource = {
  type: IResourceType;
  filename?: string;
  url: string;
  size?: number;
  message: mongoose.Types.ObjectId | string;
  conversation: mongoose.Types.ObjectId | string;
  uploader: mongoose.Types.ObjectId | string;
  isDeleted?: boolean;
  contentType?: string;
};