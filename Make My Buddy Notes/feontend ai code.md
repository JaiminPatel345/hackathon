

base on this give me all frontend thing , for now do not give much good ui part , just use simple Text and simple View . but make hooks workable means Touchables are should working 

you have to give Type at every ware in each file how start making all things , all slices , all hooks , all types , all apis and everything



## **Make My Buddy – Educational App for Hackathon**

This is an educational app designed for a hackathon, so the focus is on rapid development, a high-quality UI with smooth animations, and the use of technologies that simplify coding as much as possible.

### **Technology Stack**

- **Framework**: React Native (Expo)
    
- **Styling**: NativeWind , any othet ui as you want 
    
- **State Management**: Redux
    
- **Navigation**: Expo Router
    

## **Concept of the App**

- Users can log in and access all features.
    
- They can **search for other users**, add them as buddies, or manage their buddy list.
    
- A **buddy** is a special user, limited to **one at a time**.
    
- Users can **create tasks with their buddy** and add them to a shared schedule.
    
- Buddies are like **study partners**; they can chat and collaborate.
    
- Users can find buddies **based on their study goals**.
    
- While creating an account, users set their goals, e.g.,
    
    - **Title**: JEE Main
        
    - **Target**: Rank under 3 digits
        
    - **Year**: 2027
        
    - **Level**: Intermediate
        
    - Based on this, the system suggests suitable buddies.
        
- Users can also **join communities** like "JEE Main," "JEE Math," or "JEE 2027" to interact and find buddies.
    
- Communication methods include **chat, Google Meet integration, and resource sharing**.
    

## **App Navigation (Bottom Tabs)**

1. **Home**
    
2. **Chat**
    
3. **Resources**
    
4. **Profile**
    

---

## **Feature Breakdown**

### **Home**

- Displays the **main goal** and buddy suggestions (if not yet chosen).
    
- **Calendar View**:
    
    - Shows task deadlines.
        
    - Syncs with the buddy’s schedule.
        
- **Notifications**:
    
    - Ongoing meetings
        
    - Buddy requests
        
    - Community updates
        
- **Daily Tasks**:
    
    - Progress comparison between the user and their buddy.
        
    - Checklist-style display (users can mark only their own tasks as done).
        
    - When a buddy marks a task as done, it changes color.
        
- **Task Creation Button**:
    
    - Opens a dialog for adding a new task.
        
- **Long-term Goals**:
    
    - Weekly, monthly, and yearly objectives.
        
- Additional features may be added as needed.
    

### **Chat**

- **Private & Community Chats**
    
- Functions similar to a standard chat app.
    

### **Resources**

- Organized into **three UI-based folders**:
    
    1. **Images**
        
    2. **PDFs**
        
    3. **Links**
        
- Each section has a **searchable resource list**.
    

### **Profile**

- Displays **user profile information**.
    
- A small section for the **buddy's profile**.
    
- Three-dot menu with:
    
    - **Edit Profile**
        
    - **Blocked Users**
        
    - **Previous Buddies**
        

---

## **Screens & API Schema**

A **Postman collection** (`Make My Buddy.postman_collection.json`) is provided as a reference for API endpoints and data structure. Follow this for API integration and route values.

---

## **Development Guidelines**

### **Project Structure**

- **All source code is inside `src/`**
    
- **Configuration files remain in the root directory**
    

📂 **Project Root**  
├── 📂 **src/**  
│ ├── 📂 **api/** (API calls: `user.api.ts`, `chat.api.ts`, `axiosInstance.ts`, etc.)  
│ ├── 📂 **redux/** (State management: reducers, actions, thunks)  
│ ├── 📂 **types/** (TypeScript types)  
│ ├── 📂 **app/** (Screens & pages)  
│ │ ├── 📂 **auth/** (Login, Signup)  
│ │ ├── 📂 **user/** (User-related pages)  
│ │ ├── 📂 **chat/** (Chat screens)  
│ │ ├── 📂 **task/** (Task management screens)  
│ │ ├── 📂 **user/profile/[id].ts** (Dynamic user profile pages)  
│ ├── 📂 **components/** (Reusables)  
│ ├── 📂 **utils/** (Helper functions)

### **Key Implementation Details**

- **Expo Router** for structured navigation.
    
- **API integration** using the provided Postman collection.
    
- **Minimal code duplication** by modularizing components and utilities.
    
- **Single Token Authentication**:
    
    - Uses **one long-lived token (1-year lifespan)** instead of access/refresh tokens for simplicity.
        
    - Uses **Bearer Authorization** for API requests.
        

---

## **Final Notes**

- The app should be **fast, visually appealing, and easy to use**.
    
- **Animations & UI** should be well-optimized.
    
- The **buddy system** and **task management** should be intuitive.
    
- Keep the code **clean and modular** to support scalability.




## Current status
- I make expo app with native wind , working file , alble to print hello world .
- you have to re write all file if you want 
- give all file in seperate code with it's location .


-------
Model from backend 
import mongoose, {Document, Schema} from "mongoose";

// Define as an enum instead of an object
export enum IConversationType {
  PERSONAL = 'personal',
  COMMUNITY = 'community'
}

export interface IConversation extends Document {
  title?: string;
  description?: string;
  type?: IConversationType;
  participants?: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId;
  readBy: mongoose.Types.ObjectId[];
}

import mongoose from "mongoose";

export const IMessageType = {
  TEXT: "text",
  RESOURCE: "resource",
  MEETING: "meeting",
} as const;


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


import mongoose, {Document} from "mongoose";

export enum TaskCategory {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export interface ITask extends Document {
  content: string;
  isDoneByMe: boolean;
  isDoneByBuddy: boolean;
  category: TaskCategory;
  finishDate: Date;
  isDeleted: boolean;
  isPrivate: boolean;
  participants: mongoose.Types.ObjectId[];
  progressOfMe:string;
  progressOfBuddy:string;
  createdAt: Date;
  updatedAt: Date;
}



import mongoose from "mongoose";

export interface IUser {
  name: string;
  username: string;
  hashPassword: string;
  email: string;
  mobile: string;
  goal: {
    title: string;
    target: string;
    year: number;
    level: IGoalLevel;
  };
  interests: string[];
  buddy:mongoose.Types.ObjectId | null;
  buddies:mongoose.Types.ObjectId[];
  blockedUsers:mongoose.Types.ObjectId[];
  pvsBuddy:mongoose.Types.ObjectId[];
  avatar:string;
  isMobileVerified: boolean;
  isActive:boolean;
  isAdmin:boolean;
  communities:mongoose.Types.ObjectId[];
  lastActive:Date;
  status:string;
  conversations:mongoose.Types.ObjectId[];
}

export enum IGoalLevel {
  EXPERT = "EXPERT",        // Very skilled and experienced
  INTERMEDIATE = "INTERMEDIATE", // Decent skill but still learning
  BEGINNER = "BEGINNER",    // Just starting out
}

export interface UserQuery {
  username?: string;
  _id?: string;
  [key: string]: any; // For any other potential query params
}