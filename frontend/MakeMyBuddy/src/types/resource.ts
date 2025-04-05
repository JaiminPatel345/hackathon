export enum IResourceType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
  DOCUMENT = 'document',
  LINK = 'link',
  OTHER = 'other',
}

export interface IResource {
  _id: string;
  type: IResourceType;
  filename?: string;
  url: string;
  size?: number;
  message: string;
  conversation: string;
  uploader: string;
  isDeleted?: boolean;
  contentType?: string;
}