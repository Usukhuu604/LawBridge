export interface User {
  id: string;
  name: string;
  isLawyer: boolean;
  avatar: string;
}

export interface Message {
  id: string;
  chatRoomId: string;
  userId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  createdAt: string;
}
