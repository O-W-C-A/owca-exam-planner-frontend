'use client';
import { Calendar, Inbox } from 'lucide-react';
import { Sidebar } from '@/app/components/Sidebar';

const professorNavItems = [
  {
    title: 'Calendar',
    href: '/dashboard/professor/calendar',
    icon: Calendar,
  },
  {
    title: 'Inbox',
    href: '/dashboard/professor/inbox',
    icon: Inbox,
  }
];

export function ProfessorSidebar() {
  return <Sidebar navItems={professorNavItems} />;
}
