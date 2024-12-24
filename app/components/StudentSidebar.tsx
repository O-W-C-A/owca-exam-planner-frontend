'use client';
import { Calendar, Inbox } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import SidebarTrigger from './SidebarTrigger';

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
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="relative flex h-full">
      <div
        className={cn(
          'h-full border-r bg-white transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <nav className="p-2 pt-4">
          {studentNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900',
                pathname === item.href ? 'bg-gray-100 text-gray-900' : '',
                isCollapsed ? 'justify-center' : ''
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="absolute -right-3 top-3">
        <SidebarTrigger
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'rounded-full bg-white shadow-md border',
            isCollapsed ? 'rotate-180' : ''
          )}
        />
      </div>
    </div>
  );
}
