// Define the shape of the RootState
// This will be imported by thunks instead of importing from store.ts
// to avoid circular dependencies
export interface RootState {
  auth: {
    token: string | null;
    user: any;
    isAuthenticated: boolean;
  };
  tasks: {
    tasks: any[];
    loading: boolean;
    error: string | null;
  };
  chat: {
    conversations: any[];
    messages: Record<string, any[]>;
    activeConversationId: string | null;
    loading: boolean;
    error: string | null;
  };
  buddyRequests: {
    sentRequests: any[];
    receivedRequests: any[];
    loading: boolean;
    error: string | null;
  };
} 