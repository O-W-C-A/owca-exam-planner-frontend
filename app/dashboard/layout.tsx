import { SidebarProvider, SidebarTrigger } from '@/app/components/sidebar';
import React from 'react';
import { AppSidebar } from '../components/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            <div>{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
