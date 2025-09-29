"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import PrettyChatButton from "../PrettyChatButton";
import CustomUserButton from "./CustomUserButton";

const navLinks = [
  { label: "Өмгөөлөгчид", href: "/find-lawyers" },
  { label: "Нийтлэл унших", href: "/legal-articles" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const role = user?.publicMetadata?.role;

  switch (pathname) {
    case "/lawyer-form":
    case "/sign-in":
    case "/sign-up":
    case "/sign-up/lawyer":
      return null;
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4 flex items-center justify-between relative">
        <Link
          href="/"
          className="text-2xl text-[#003366] font-extrabold font-playfair-display"
        >
          LawBridge
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 text-xl hover:text-[#003366] transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4">
          <PrettyChatButton unreadCount={0} isOnline={true} />

          <div className="hidden md:flex gap-6 items-center">
            <SignedOut>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#003366]"
                  asChild
                >
                  <Link href="/sign-in">Log In</Link>
                </Button>
                <Button size="sm" className="bg-[#003366] text-cyan-50" asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </SignedOut>

            <SignedIn>
              {role === "lawyer" ? (
                <CustomUserButton
                  afterSignOutUrl="/sign-in"
                  userProfileMode="navigation"
                  userProfileUrl="/my-profile/me"
                />
              ) : (
                <UserButton afterSignOutUrl="/sign-in" />
              )}
            </SignedIn>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {isOpen ? (
              <button
                className="text-gray-600 p-1"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            ) : (
              <>
                <SignedIn>
                  {role === "lawyer" ? (
                    <CustomUserButton
                      afterSignOutUrl="/sign-in"
                      userProfileMode="navigation"
                      userProfileUrl="/my-profile/me"
                    />
                  ) : (
                    <UserButton afterSignOutUrl="/sign-in" />
                  )}
                </SignedIn>

                <button
                  className="text-gray-600 p-1"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-2 pb-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-700 hover:text-[#003366]"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <SignedOut>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border border-[#003366] text-[#003366]"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button
                size="sm"
                className="w-full bg-[#003366] text-cyan-50"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
}
