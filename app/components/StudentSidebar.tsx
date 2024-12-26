'use client';
import { Calendar, Inbox } from 'lucide-react';
import { Sidebar } from '@/app/components/Sidebar';

const studentNavItems = [
  {
    title: 'Calendar',
    href: '/dashboard/student/calendar',
    icon: Calendar,
  },
  {
    title: 'Inbox',
    href: '/dashboard/student/inbox',
    icon: Inbox,
  }
];

export function StudentSidebar() {
  return <Sidebar navItems={studentNavItems} />;
}
