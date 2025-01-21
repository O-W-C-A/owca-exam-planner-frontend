"use client";
import React, { useEffect, useState } from "react";
import { StudentLeaderSidebar } from "@/app/components/StudentLeaderSidebar";

export default function StudentLeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <StudentLeaderSidebar />
      <main className="flex-1 p-6 flex flex-col min-h-0">{children}</main>
    </>
  );
}
