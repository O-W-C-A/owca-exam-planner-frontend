import React from "react";
import TopBar from "@/app/components/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <TopBar className="flex-none" />
      <div className="flex-1 flex min-h-0">{children}</div>
    </div>
  );
}
