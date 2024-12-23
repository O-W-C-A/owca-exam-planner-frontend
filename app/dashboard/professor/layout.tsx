'use client';
import React, { useEffect, useState } from 'react';

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <main className="flex-1 p-6 flex flex-col min-h-0">
        {children}
      </main>
    </>
  );
} 