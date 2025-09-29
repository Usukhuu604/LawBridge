// src/socket/constants.ts

export const SOCKET_EVENTS = {
    // Client-to-Server
    CLIENT_CONNECT: "connection",
    CLIENT_DISCONNECT: "disconnect",
    CLIENT_SEND_MESSAGE: "client:send_message",
    CLIENT_START_TYPING: "client:start_typing",
    CLIENT_STOP_TYPING: "client:stop_typing",
  
    // Server-to-Client
    SERVER_UPDATE_ONLINE_USERS: "server:update_online_users",
    SERVER_RECEIVE_MESSAGE: "server:receive_message",
    SERVER_USER_IS_TYPING: "server:user_is_typing",
    SERVER_USER_STOPPED_TYPING: "server:user_stopped_typing",
  };
  
  export const AUTH_ERROR = "AuthenticationError";