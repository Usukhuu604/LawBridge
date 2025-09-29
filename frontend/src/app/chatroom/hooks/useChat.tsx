// "use client";

// import { useEffect, useState } from "react";
// import { connectSocket } from "@/lib/socket"; // шинэчлэгдсэн socket connection функц


// interface ChatMessage {
//   id: string;
//   chatRoomId: string;
//   content: string;
//   type: string;
//   timestamp: string;
//   from: {
//     id: string;
//     username: string;
//     avatar?: string;
//   };
// }

// export default function useChat(currentUserId: string, targetUserId: string, chatRoomId: string) {
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
//   const [isSending, setIsSending] = useState(false);
//   const [typing, setTyping] = useState(false);

//   useEffect(() => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("clerkToken") || "" : "";

//     const socket = getSocket(token); // ✅ зөвхөн client талд холбох
//     if (!socket.connected) {
//       socket.connect();
//       socket.emit("join", currentUserId);
//     }

//     const handleMessage = (msg: ChatMessage) => {
//       setChatMessages((prev) => [...prev, msg]);
//     };

//     const handleTyping = ({ chatRoomId: room, user }: any) => {
//       if (room === chatRoomId && user.id !== currentUserId) {
//         setTyping(true);
//       }
//     };

//     const handleStopTyping = ({ chatRoomId: room, user }: any) => {
//       if (room === chatRoomId && user.id !== currentUserId) {
//         setTyping(false);
//       }
//     };

//     socket.on("chat-message", handleMessage);
//     socket.on("user-is-typing", handleTyping);
//     socket.on("user-stopped-typing", handleStopTyping);

//     return () => {
//       socket.off("chat-message", handleMessage);
//       socket.off("user-is-typing", handleTyping);
//       socket.off("user-stopped-typing", handleStopTyping);
//     };
//   }, [currentUserId, chatRoomId]);

//   const send = (content: string, type = "TEXT") => {
//     if (!content.trim()) return;

//     setIsSending(true);
//     const socket = getSocket(); // use already initialized socket
//     socket.emit("chat-message", {
//       chatRoomId,
//       toUserId: targetUserId,
//       content,
//       type,
//     });
//     setIsSending(false);
//   };

//   const startTyping = () => {
//     const socket = getSocket();
//     socket.emit("start-typing", chatRoomId);
//   };

//   const stopTyping = () => {
//     const socket = getSocket();
//     socket.emit("stop-typing", chatRoomId);
//   };

//   return { chatMessages, send, isSending, typing, startTyping, stopTyping };
// }
