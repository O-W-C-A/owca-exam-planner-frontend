import React from 'react';
import { cn } from '@/utils/cn'; // Assuming this utility is correct

const SidebarContent: React.FC = ({ className, children }) => (
  <div className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto', className)}>
    {children}
  </div>
);

export default SidebarContent;
