// import React from "react";

// interface ConnectionStatusProps {
//   isConnected: boolean;
//   isJoining: boolean;
// }

// const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, isJoining }) => (
//   <div className="fixed top-4 right-4 z-40 transition-all duration-300 ease-in-out">
//     <div
//       className={`
//       px-3 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm
//       ${
//         isJoining
//           ? "bg-yellow-100/90 text-yellow-800 border border-yellow-200"
//           : isConnected
//           ? "bg-green-100/90 text-green-800 border border-green-200"
//           : "bg-red-100/90 text-red-800 border border-red-200"
//       }
//     `}
//     >
//       <div className="flex items-center space-x-2">
//         <div
//           className={`
//           w-2 h-2 rounded-full animate-pulse
//           ${
//             isJoining
//               ? "bg-yellow-500"
//               : isConnected
//               ? "bg-green-500"
//               : "bg-red-500"
//           }
//         `}
//         ></div>
//         <span>
//           {isJoining
//             ? "Connecting..."
//             : isConnected
//             ? "Connected"
//             : "Disconnected"}
//         </span>
//       </div>
//     </div>
//   </div>
// );

// export default ConnectionStatus; 