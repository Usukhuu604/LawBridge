// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import useChat from "../hooks/useChat";

// interface ChatProps {
//   currentUserId: string;
//   targetUserId: string;
//   chatRoomId: string;
// }

// const Chat: React.FC<ChatProps> = ({ currentUserId, targetUserId, chatRoomId }) => {
//   const { chatMessages, send, isSending, typing, startTyping, stopTyping } = useChat(
//     currentUserId,
//     targetUserId,
//     chatRoomId
//   );
//   const [message, setMessage] = useState("");
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [chatMessages]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setMessage(e.target.value);
//     if (e.target.value.trim() !== "") {
//       startTyping();
//     } else {
//       stopTyping();
//     }
//   };

//   const handleSend = () => {
//     if (message.trim() === "") return;
//     send(message.trim());
//     setMessage("");
//     stopTyping();
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full p-4">
//       <div
//         ref={scrollRef}
//         className="flex-1 overflow-y-auto space-y-2 mb-4 border p-2 rounded"
//       >
//         {chatMessages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 rounded ${
//               msg.from.id === currentUserId ? "bg-blue-200 self-end" : "bg-gray-200 self-start"
//             } max-w-xs break-words`}
//           >
//             <div className="text-sm font-semibold">{msg.from.username}</div>
//             <div className="text-base">{msg.content}</div>
//             <div className="text-xs text-gray-500">
//               {new Date(msg.timestamp).toLocaleTimeString()}
//             </div>
//           </div>
//         ))}
//         {typing && <div className="italic text-gray-500">Хөгжүүлэгч бичиж байна...</div>}
//       </div>
//       <div className="flex space-x-2">
//         <input
//           type="text"
//           className="flex-grow border rounded px-2 py-1"
//           value={message}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyPress}
//           placeholder="Мессеж бичнэ үү..."
//         />
//         <button
//           onClick={handleSend}
//           disabled={isSending}
//           className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
//         >
//           Илгээх
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
