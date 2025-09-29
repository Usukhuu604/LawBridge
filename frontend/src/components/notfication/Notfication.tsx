"use client";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import {
  Bell,
  CheckCircle,
  Calendar,
  Star,
  UserCheck,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const GET_NOTIFICATIONS = gql`
  query MyNotifications($filter: NotificationsFilterInput) {
    myNotifications(filter: $filter) {
      id
      recipientId
      type
      content
      read
      createdAt
    }
  }
`;

const MARK_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      read
    }
  }
`;

const MARK_ALL_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

const NOTIFICATION_ICONS = {
  LAWYER_APPROVED: <UserCheck className="h-5 w-5 text-green-600" />,
  APPOINTMENT_CREATED: <Calendar className="h-5 w-5 text-blue-600" />,
  APPOINTMENT_REMINDER: <Bell className="h-5 w-5 text-orange-500" />,
  APPOINTMENT_STARTED: <MessageCircle className="h-5 w-5 text-purple-600" />,
  REVIEW_RECEIVED: <Star className="h-5 w-5 text-yellow-500" />,
};

const NOTIFICATION_LABELS = {
  LAWYER_APPROVED: "Lawyer Approved",
  APPOINTMENT_CREATED: "Appointment Created",
  APPOINTMENT_REMINDER: "Appointment Reminder",
  APPOINTMENT_STARTED: "Appointment Started",
  REVIEW_RECEIVED: "Review Received",
};

interface Notification {
  id: string;
  recipientId: string;
  type: "LAWYER_APPROVED" | "APPOINTMENT_CREATED" | "APPOINTMENT_REMINDER" | "APPOINTMENT_STARTED" | "REVIEW_RECEIVED";
  content: string;
  read: boolean;
  createdAt: string;
}

export default function Notfication() {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { filter: showUnreadOnly ? { read: false } : {} },
    fetchPolicy: "cache-and-network",
  });
  const [markAsRead] = useMutation(MARK_AS_READ);
  const [markAllAsRead] = useMutation(MARK_ALL_AS_READ);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const notifications: Notification[] = data?.myNotifications || [];
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead({ variables: { notificationId: id } });
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
          <Bell className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Notifications</h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Notifications</h1>
            <p className="text-slate-600 text-sm">You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              onClick={() => setShowUnreadOnly((v) => !v)}
              className="flex items-center gap-2"
            >
              <Circle className={`h-4 w-4 ${showUnreadOnly ? "text-blue-600" : "text-slate-400"}`} />
              {showUnreadOnly ? "Show All" : "Show Unread"}
            </Button>
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              Mark All as Read
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
              <Bell className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No Notifications</h3>
              <p className="text-slate-500">You&apos;re all caught up!</p>
            </div>
          ) : (
            notifications.map((n: Notification) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 bg-white rounded-xl shadow border border-slate-200 p-4 transition-all duration-200 ${n.read ? "opacity-70" : ""}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {NOTIFICATION_ICONS[n.type as keyof typeof NOTIFICATION_ICONS] || <Bell className="h-5 w-5 text-slate-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">
                      {NOTIFICATION_LABELS[n.type as keyof typeof NOTIFICATION_LABELS] || n.type}
                    </span>
                    {!n.read && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">New</span>}
                  </div>
                  <div className="text-slate-700 text-sm mb-2">
                    {n.content.length > 120 && !expanded[n.id] ? (
                      <>
                        {n.content.substring(0, 120)}...
                        <button
                          className="ml-2 text-blue-600 hover:underline text-xs"
                          onClick={() => toggleExpand(n.id)}
                        >
                          <ChevronDown className="inline h-3 w-3" /> More
                        </button>
                      </>
                    ) : n.content.length > 120 ? (
                      <>
                        {n.content}
                        <button
                          className="ml-2 text-blue-600 hover:underline text-xs"
                          onClick={() => toggleExpand(n.id)}
                        >
                          <ChevronUp className="inline h-3 w-3" /> Less
                        </button>
                      </>
                    ) : (
                      n.content
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 