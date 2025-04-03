export interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: string; // User ID
  createdAt: string;
}

export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: string[]; // Array of User IDs
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}