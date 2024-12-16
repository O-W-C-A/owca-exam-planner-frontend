'use client';
import { Calendar, Inbox, Search, Settings, LogOut, } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/app/components/sidebar';

// Menu items.
const items = [
  {
    title: 'Calendar',
    url: '/',
    icon: Calendar,
  },
  {
    title: 'Inbox',
    url: 'inbox',
    icon: Inbox,
  },
  {
    title: 'Prof-inbox',
    url: 'prof-inbox',
    icon: Inbox,
  },
  {
    title: 'Search',
    url: 'search',
    icon: Search,
  },

  {
    title: 'Settings',
    url: 'settings',
    icon: Settings,
  },

  {
    title: 'Logout',
    url: 'logout',
    icon: LogOut,
  }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Exam programming</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
