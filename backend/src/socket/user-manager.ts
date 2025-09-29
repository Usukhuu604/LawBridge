// src/socket/UserManager.ts

// Define the shape of the user data we'll store
export interface OnlineUser {
    id: string; // Clerk User ID
    username: string;
    firstName?: string;
    lastName?: string;
    imageUrl: string;
    socketId: string;
  }
  
  class UserManager {
    private connectedUsers: Map<string, OnlineUser>; // Key is socket.id
  
    constructor() {
      this.connectedUsers = new Map();
    }
  
    addUser(user: OnlineUser): void {
      this.connectedUsers.set(user.socketId, user);
      console.log(`[UserManager] User added: ${user.username}. Total users: ${this.connectedUsers.size}`);
    }
  
    removeUser(socketId: string): OnlineUser | undefined {
      const user = this.connectedUsers.get(socketId);
      if (user) {
        this.connectedUsers.delete(socketId);
        console.log(`[UserManager] User removed: ${user.username}. Total users: ${this.connectedUsers.size}`);
      }
      return user;
    }
  
    getUser(socketId: string): OnlineUser | undefined {
      return this.connectedUsers.get(socketId);
    }
  
    getOnlineUsers(): OnlineUser[] {
      return Array.from(this.connectedUsers.values());
    }
  }
  
  // Export a singleton instance so the same manager is used across the app
  export const userManager = new UserManager();