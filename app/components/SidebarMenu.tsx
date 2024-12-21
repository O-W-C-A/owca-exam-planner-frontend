import React from 'react';
import { cn } from '@/utils/cn'; // Assuming this utility is correct

const SidebarMenu: React.FC = ({ className, children }) => (
  <ul className={cn('flex w-full min-w-0 flex-col gap-1', className)}>
    {children}
  </ul>
);

export default SidebarMenu;
