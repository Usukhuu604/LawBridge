"use client";
import { useQuery, gql } from "@apollo/client";
import { Calendar, MessageCircle, FileText } from "lucide-react";

const GET_APPOINTMENTS = gql`
  query GetAppointments {
    getAppointments {
      clientId
      lawyerId
      schedule
      status
      chatRoomId
      price
      isFree
      specializationId
      createdAt
      endedAt
    }
  }
`;

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      id
      lawyerId
      title
      createdAt
    }
  }
`;

const GET_CHAT_HISTORY = gql`
  query GetChatHistory {
    getChatHistory {
      userId
      _id
    }
  }
`;

export default function DashboardHeader() {
  const { data: appointmentsData } = useQuery(GET_APPOINTMENTS);
  const { data: postsData } = useQuery(GET_POSTS);
  const { data: chatHistoryData } = useQuery(GET_CHAT_HISTORY);

  const totalAppointments = appointmentsData?.getAppointments?.length || 0;
  const totalPosts = postsData?.getPosts?.length || 0;
  // Count unique userIds who have chatted with the bot
  const uniqueChatUsers = chatHistoryData?.getChatHistory
    ? Array.from(new Set(chatHistoryData.getChatHistory.map((msg: { userId: string }) => msg.userId))).length
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-5">
      <div className="bg-white rounded-xl p-6 shadow flex items-center gap-4 border border-slate-200">
        <Calendar className="h-10 w-10 text-blue-600" />
        <div>
          <p className="text-sm text-slate-500 font-medium">Appointments Booked</p>
          <p className="text-3xl font-bold text-slate-800">{totalAppointments}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow flex items-center gap-4 border border-slate-200">
        <MessageCircle className="h-10 w-10 text-green-600" />
        <div>
          <p className="text-sm text-slate-500 font-medium">Chatbot Users</p>
          <p className="text-3xl font-bold text-slate-800">{uniqueChatUsers}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow flex items-center gap-4 border border-slate-200">
        <FileText className="h-10 w-10 text-purple-600" />
        <div>
          <p className="text-sm text-slate-500 font-medium">Posts</p>
          <p className="text-3xl font-bold text-slate-800">{totalPosts}</p>
        </div>
      </div>
    </div>
  );
}