"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import ChatRoom from "@/components/chat/ChatRoom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Search,
  Loader2,
  AlertCircle,
  X,
  Menu,
  MessageSquare,
  WifiOff,
  ArrowLeft,
} from "lucide-react";
import { debounce } from "lodash";
import ChatroomHeader from "@/components/chat/ChatroomHeader";
import ChatListItem from "@/components/chat/ChatListItem";
import { SocketProvider } from "@/context/SocketContext";
import { useGetChatRoomByUserQuery, useGetLawyerByIdQuery } from "@/generated";
import { useDeleteAllMessages } from "@/hooks/useDeleteAllMessages";

// Using generated queries from @/generated

// Using generated types from @/generated
import type { GetChatRoomByUserQuery, GetLawyerByIdQuery } from "@/generated";

type ChatRoom = GetChatRoomByUserQuery["getChatRoomByUser"][0];

// Custom hook for responsive design
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Only access window on client side
    if (typeof window !== "undefined") {
      const updateSize = () => {
        const width = window.innerWidth;
        setIsMobile(width < 768);
        setIsTablet(width >= 768 && width < 1024);
      };

      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  return { isMobile, isTablet, isClient };
};

// Custom hook for network status
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Only access navigator on client side
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const updateOnlineStatus = () => setIsOnline(navigator.onLine);

      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);

      return () => {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      };
    }
  }, []);

  return { isOnline, isClient };
};

const MessengerLayoutContent = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const userId = user?.id;

  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [showHeader] = useState(true); // Toggle for header visibility
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Delete messages hook
  const { deleteAllMessages, loading: isDeletingMessages } =
    useDeleteAllMessages();

  const { isMobile, isTablet, isClient: responsiveClient } = useResponsive();
  const { isOnline, isClient: networkClient } = useNetworkStatus();

  // Debounced search query
  const debouncedSetSearch = useCallback(
    debounce((query: string) => setDebouncedSearchQuery(query), 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);

  // Auto-close sidebar on mobile when screen size changes
  useEffect(() => {
    if (isMobile && selectedRoomId) {
      setSidebarOpen(false);
    } else if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile, selectedRoomId]);

  // Ensure sidebar is open on desktop when header is hidden
  useEffect(() => {
    if (!isMobile && !showHeader) {
      setSidebarOpen(true);
    }
  }, [isMobile, showHeader]);

  // Enhanced query with error handling and retry logic
  const { data, loading, error, refetch } = useGetChatRoomByUserQuery({
    variables: { userId: userId || "" },
    skip: !userId || !userLoaded,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    pollInterval: isOnline ? 30000 : 0, // Stop polling when offline
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      console.error("Chat rooms query error:", err);
    },
  });

  // Get selected room and other participant
  const selectedRoomObj = useMemo(
    () =>
      data?.getChatRoomByUser?.find((r: ChatRoom) => r._id === selectedRoomId),
    [data?.getChatRoomByUser, selectedRoomId]
  );

  const selectedOtherId = useMemo(
    () => selectedRoomObj?.participants.find((id: string) => id !== userId),
    [selectedRoomObj?.participants, userId]
  );

  // Fetch lawyer info for the selected chat with error handling
  const { data: selectedLawyerData } = useGetLawyerByIdQuery({
    variables: { lawyerId: selectedOtherId || "" },
    skip: !selectedOtherId,
    errorPolicy: "all",
  });

  // Enhanced profile getter with fallback handling
  const getProfile = useCallback(
    (id: string) => {
      if (id === userId) {
        return {
          name: user?.fullName || user?.firstName || "Та",
          avatar: user?.imageUrl || "",
          initials:
            user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || "Т",
        };
      }
      return {
        name: `User ${id.slice(-4)}`,
        avatar: "",
        initials: id.charAt(0).toUpperCase(),
      };
    },
    [userId, user]
  );

  // Memoized chat rooms with sorting
  const chatRooms: ChatRoom[] = useMemo(() => {
    const rooms = data?.getChatRoomByUser || [];

    // Sort by last message timestamp
    return [...rooms].sort((a, b) => {
      // Sort by last message timestamp
      const aTime = a.lastMessage?.ChatRoomsMessages?.[0]?.createdAt
        ? new Date(a.lastMessage.ChatRoomsMessages[0].createdAt).getTime()
        : 0;
      const bTime = b.lastMessage?.ChatRoomsMessages?.[0]?.createdAt
        ? new Date(b.lastMessage.ChatRoomsMessages[0].createdAt).getTime()
        : 0;
      return bTime - aTime;
    });
  }, [data]);

  // Enhanced filtered rooms with better search logic
  const filteredRooms: ChatRoom[] = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return chatRooms;

    const query = debouncedSearchQuery.toLowerCase();
    return chatRooms.filter((room: ChatRoom) => {
      const otherId = room.participants.find((id: string) => id !== userId);
      if (!otherId) return false;

      const profile = getProfile(otherId);
      const lastMessage =
        room.lastMessage?.ChatRoomsMessages?.[0]?.content?.toLowerCase() || "";

      return (
        profile.name.toLowerCase().includes(query) ||
        lastMessage.includes(query) ||
        otherId.toLowerCase().includes(query)
      );
    });
  }, [debouncedSearchQuery, chatRooms, userId, getProfile]);

  // Note: We no longer need the complex lawyer mapping logic
  // The useUserInfo hook handles both lawyers and clients automatically

  // Enhanced handlers
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSelectRoom = useCallback(
    (roomId: string) => {
      setSelectedRoomId(roomId);
      if (isMobile) {
        setSidebarOpen(false);
      }
    },
    [isMobile]
  );

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    refetch().catch(console.error);
  }, [refetch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  const handleDeleteMessages = useCallback(
    async (roomId: string) => {
      try {
        setDeletingRoomId(roomId);
        await deleteAllMessages(roomId);

        // If the deleted room was selected, clear the selection
        if (selectedRoomId === roomId) {
          setSelectedRoomId("");
        }

        // Show success message (you could add a toast notification here)
        console.log("Messages deleted successfully");
      } catch (error) {
        console.error("Failed to delete messages:", error);
        // Show error message (you could add a toast notification here)
      } finally {
        setDeletingRoomId(null);
      }
    },
    [deleteAllMessages, selectedRoomId]
  );

  // Keyboard shortcuts
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            searchInputRef.current?.focus();
            break;
          case "b":
            e.preventDefault();
            toggleSidebar();
            break;
        }
      }

      if (e.key === "Escape") {
        if (searchQuery) {
          clearSearch();
        } else if (isMobile && sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, clearSearch, searchQuery, isMobile, sidebarOpen]);

  // Loading states
  const isInitialLoading = loading && !data;
  const isRefreshing = loading && !!data;

  // Only render when client-side is ready
  const isClient = responsiveClient && networkClient;

  // Prevent hydration mismatch by not rendering until client-side is ready
  if (!isClient) {
    return (
      <div className="h-screen w-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-800 chatroom-container">
      {/* Network status indicator */}
      {isClient && !isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-primary-custom text-white text-center py-2 text-sm z-50">
          <WifiOff className="inline w-4 h-4 mr-2" />
          Интернетийн холболт тасарсан байна
        </div>
      )}
      {/* Main Content Container */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"} ${
            isTablet ? "w-[320px]" : "w-[380px]"
          }`}
        >
          <aside className="w-full h-full flex flex-col shadow-lg bg-white border-r border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 relative bg-gradient-to-r from-white to-gray-50 shadow-sm">
              {/* Left side - Back button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="p-2.5 hover:bg-primary-custom/10 rounded-full transition-all duration-200"
                aria-label="Буцах"
              >
                <ArrowLeft className="w-5 h-5 text-primary-custom" />
              </Button>

              {/* Center - Title and refresh indicator */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-custom/10 rounded-full">
                  <MessageCircle className="w-6 h-6 text-primary-custom" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Чатууд</h2>
                {isRefreshing && (
                  <Loader2 className="w-4 h-4 animate-spin text-primary-custom" />
                )}
              </div>

              {/* Right side - Close button (mobile only) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="md:hidden p-2.5 hover:bg-primary-custom/10 rounded-full transition-all duration-200"
                aria-label="Sidebar хаах (Ctrl+B)"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-custom" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Хайх... (Ctrl+K)"
                  className="pl-12 pr-12 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-primary-custom focus:ring-2 focus:ring-primary-custom/20 transition-all duration-200 placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 hover:bg-gray-200"
                    aria-label="Хайлт цэвэрлэх"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {debouncedSearchQuery && (
                <p className="text-xs text-gray-500 mt-2">
                  &quot{debouncedSearchQuery}&quot хайж байна...
                </p>
              )}
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto">
              {isInitialLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-custom" />
                  <p className="text-sm text-gray-500">
                    Чатууд ачааллаж байна...
                  </p>
                </div>
              ) : error && !data ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
                  <div className="p-4 rounded-full bg-gray-100">
                    <AlertCircle className="w-8 h-8 text-primary-custom" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-custom mb-1">
                      Алдаа гарлаа
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {!isOnline
                        ? "Интернетийн холболтоо шалгана уу"
                        : "Чатуудыг ачаалахад алдаа гарлаа"}
                    </p>
                    {retryCount > 0 && (
                      <p className="text-xs text-gray-400">
                        Оролдлого: {retryCount}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="sm"
                    disabled={!isOnline}
                  >
                    <Loader2 className="w-4 h-4 mr-2" />
                    Дахин оролдох
                  </Button>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
                  <div className="p-4 rounded-full bg-gray-100">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600 mb-1">
                      {searchQuery
                        ? "Хайлтын үр дүн олдсонгүй"
                        : "Чат олдсонгүй"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {searchQuery
                        ? "Өөр түлхүүр үг оролдоно уу"
                        : "Шинэ чат эхлүүлээрэй"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredRooms.map((room: ChatRoom) => {
                    const otherId = room.participants.find(
                      (id: string) => id !== userId
                    );
                    const selected = room._id === selectedRoomId;
                    const hasUnread = false; // unreadCount not available in generated type

                    return (
                      <ChatListItem
                        key={room._id}
                        roomId={room._id}
                        otherId={otherId || ""}
                        selected={selected}
                        hasUnread={hasUnread}
                        lastMessage={
                          room.lastMessage?.ChatRoomsMessages?.[0]?.content
                        }
                        onSelect={handleSelectRoom}
                        onDelete={handleDeleteMessages}
                        isDeleting={deletingRoomId === room._id}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Sidebar Trigger (for mobile and desktop when sidebar is hidden) */}
        {!sidebarOpen && (
          <Button
            onClick={toggleSidebar}
            className={`fixed left-4 z-50 p-3 rounded-full shadow-lg bg-primary-custom hover:bg-primary-custom ${
              isMobile ? "" : "hidden md:block"
            } top-4`}
            size="sm"
            aria-label="Sidebar нээх (Ctrl+B)"
          >
            <Menu className="w-5 h-5 text-white" />
          </Button>
        )}

        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          />
        )}

        {/* Chat Section */}
        <main
          className={`flex-1 flex flex-col h-full overflow-hidden ${
            !sidebarOpen ? "w-full" : ""
          }`}
        >
          {selectedRoomId ? (
            !sidebarOpen ? (
              <div className="flex-1 w-full chatroom-centered h-full">
                <div className="max-w-4xl mx-auto h-full">
                  <ChatRoom chatRoomId={selectedRoomId} />
                </div>
              </div>
            ) : (
              <div className="flex-1 w-full h-full">
                <ChatRoom chatRoomId={selectedRoomId} />
              </div>
            )
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400 w-full">
              <div className="text-center space-y-4 max-w-md px-4">
                <div className="p-6 rounded-full bg-gray-100 mx-auto w-fit">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-600">
                    Чат сонгогдоогүй байна
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Харилцах хүнээ сонгоод чат эхлүүлээрэй
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>⌨️ Товчлол:</p>
                    <p>Ctrl+K - Хайх</p>
                    <p>Ctrl+B - Sidebar</p>
                    <p>Esc - Гарах</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>{" "}
      {/* Close main content container */}
    </div>
  );
};

const MessengerLayout = () => {
  return (
    <SocketProvider>
      <MessengerLayoutContent />
    </SocketProvider>
  );
};

export default MessengerLayout;
