import React from "react";
import { LayoutDashboard, Users, Gavel } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui";
import Link from "next/link";

type AdminSidebarProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
};

const menuItems = [
  {
    title: "Хянах самбар",
    section: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Хуульчид",
    section: "lawyers",
    icon: Users,
  },
  {
    title: "Хуульчийн баталгаажуулалт",
    section: "lawyeraprroval",
    icon: Gavel,
  },
];

export function AdminSidebar({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  return (
    <Sidebar className="border-r bg-white">
      <div className="p-10"></div>

      <SidebarContent className="px-4 py-10">
        <SidebarGroup>
          <div className="flex justify-center items-center mb-30">
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
                  <Button
                    size="sm"
                    className="bg-[#003366] text-cyan-50"
                    asChild
                  >
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/sign-in" />
              </SignedIn>
            </div>
          </div>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Үндсэн цэс
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-gray-100 ${
                      activeSection === item.section
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSectionChange(item.section)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
