import React from 'react';
import { cn } from '@/utils/cn'; // Assuming this utility is correct

const SidebarGroup: React.FC = ({ className, children }) => (
  <div className={cn('relative flex w-full min-w-0 flex-col p-2', className)}>
    {children}
  </div>
);

export default SidebarGroup;
