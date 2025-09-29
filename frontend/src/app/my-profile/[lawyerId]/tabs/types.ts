export interface CommentType {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface PostType {
  _id: string;
  id: string;
  lawyerId: string;
  title: string;
  content: {
    text?: string;
    image?: string;
    video?: string;
    audio?: string;
  };
  specialization: Array<{
    id: string;
    categoryName: string;
  }>;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  createdAt: string;
  updatedAt?: string;
  comments: CommentType[];
}
