"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import FloatingChatbotButton from "@/components/FloatingChatbotButton";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeader =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/pending-approval") ||
    pathname.startsWith("/chatroom") ||
    pathname.startsWith("/chatbot");

  const chatbotHide =
    pathname.startsWith("/chatbot") ||
    pathname.startsWith("/pending-approval") ||
    pathname.startsWith("/chatroom") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  return (
    <>
      {!hideHeader && <Header />}
      {!chatbotHide && <FloatingChatbotButton href="/chatbot" />}
      <main className="flex justify-center items-start min-h-[calc(100vh-8rem)]">
        {children}
      </main>
    </>
  );
}
