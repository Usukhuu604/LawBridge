"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardCharts from "./DashBoardCharts";
import UserTable from "./UserTable";
import { useState } from "react";
import LawyerApprovalDashboard from "./LawyerApprovalDashboard";

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50/40">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 p-2 space-y-6">
          {activeSection === "dashboard" && (
            <>
              <DashboardHeader />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"></div>
              <div className="lg:col-span-2">
                <DashboardCharts />
              </div>
            </>
          )}
          {activeSection === "lawyers" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Хуульчид</h2>
              <UserTable />
            </div>
          )}
          {activeSection === "lawyeraprroval" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Хүлээгдэж буй Хуульчид
              </h2>
              <LawyerApprovalDashboard />
            </div>
          )}
          {/* Add more sections as needed */}
        </main>
      </div>
    </SidebarProvider>
  );
}
