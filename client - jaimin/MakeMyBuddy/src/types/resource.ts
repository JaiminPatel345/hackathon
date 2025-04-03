export type ResourceType = 'image' | 'pdf' | 'link';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
}