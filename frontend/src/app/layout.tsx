"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import {
  Geist,
  Geist_Mono,
  PT_Serif,
  Playfair_Display,
} from "next/font/google";
import { ApolloWrapper } from "@/providers/ApolloWrapper";
import Header from "@/components/header/Header";
import { SocketProvider } from "@/context/SocketContext";
// import { AuthRedirectGuard } from "@/components";
import { Toaster } from "sonner";
import FloatingChatbotButton from "@/components/FloatingChatbotButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ptSerif.variable} ${playfairDisplay.variable}`}
    >
      <body
        className={`min-h-screen bg-background font-sans antialiased ${geistSans.variable} ${geistMono.variable} ${ptSerif.variable} ${playfairDisplay.variable}`}
        suppressHydrationWarning={true}
      >
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
          <ApolloWrapper>
            {!hideHeader && <Header />}
            <SocketProvider>
              <Toaster richColors position="top-right" />

              {!chatbotHide && <FloatingChatbotButton href="/chatbot" />}
              <main
                className={`flex justify-center items-start ${
                  hideHeader ? "min-h-screen" : "min-h-[calc(100vh-4rem)]"
                }`}
              >
                {/* <AuthRedirectGuard /> */}
                {children}
              </main>
            </SocketProvider>
          </ApolloWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
