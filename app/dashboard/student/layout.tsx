import React from 'react';
import { StudentSidebar } from '@/app/components/StudentSidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudentSidebar />
      <main className="flex-1 p-6 flex flex-col min-h-0">
        {children}
      </main>
    </>
  );
} 