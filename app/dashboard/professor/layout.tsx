'use client';
import React, { useEffect, useState } from 'react';
import { ProfessorSidebar } from '@/app/components/ProfessorSidebar';

export default function ProfessorLayout({
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
      <ProfessorSidebar />
      <main className="flex-1 p-6 flex flex-col min-h-0">
        {children}
      </main>
    </>
  );
} 