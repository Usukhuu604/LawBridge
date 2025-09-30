"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { getSocket } from "@/lib/socket";

const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications {
    myNotifications {
      id
      type
      content
      read
      createdAt
    }
  }
`;

const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      read
    }
  }
`;

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
    fetchPolicy: "network-only", // Шинэчлэгдсэн data авахын тулд
  });
  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);

  const notifications = data?.myNotifications ?? [];
  interface Notification {
    id: string;
    type: string;
    content: string;
    read: boolean;
    createdAt: string;
  }

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  // Socket.IO realtime шинэ notification хүлээж авах
  useEffect(() => {
    const socket = getSocket();
    socket.on("new-notification", () => {
      refetch();
    });

    return () => {
      socket.off("new-notification");
    };
  }, [refetch]);

  // Notification дээр дарвал уншсан төлөвт оруулах
  const onNotificationClick = async (id: string) => {
    await markAsRead({ variables: { notificationId: id } });
    refetch();
    // Тухайн notification руу redirect хийх эсвэл дэлгэрэнгүй харуулах боломжтой
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative focus:outline-none"
        aria-label="Notifications"
      >
        {/* Хонхны SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread тоо */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-auto bg-white shadow-lg rounded-md z-50">
          {loading && <p className="p-4 text-center">Ачааллаж байна...</p>}
          {error && (
            <p className="p-4 text-center text-red-600">Алдаа гарлаа</p>
          )}
          {!loading && notifications.length === 0 && (
            <p className="p-4 text-center text-gray-500">Мэдэгдэл алга</p>
          )}

          {notifications.map((n: Notification) => (
            <div
              key={n.id}
              onClick={() => onNotificationClick(n.id)}
              className={`p-3 cursor-pointer border-b hover:bg-gray-100 ${
                !n.read ? "bg-blue-50" : ""
              }`}
            >
              <p className="font-semibold">{n.type.replace(/_/g, " ")}</p>
              <p className="text-sm">{n.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
