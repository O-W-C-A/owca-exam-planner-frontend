import React from 'react';
import { cn } from '@/utils/cn'; // Assuming this utility is correct

interface SidebarMenuProps {
  className?: string;
  children: React.ReactNode;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ className, children }) => (
  <ul className={cn('flex w-full min-w-0 flex-col gap-1', className)}>
    {children}
  </ul>
);

export default SidebarMenu;
