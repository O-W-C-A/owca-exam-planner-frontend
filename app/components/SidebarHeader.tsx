import React from 'react';
import { cn } from '@/utils/cn'; // Assuming this utility is correct

const SidebarHeader: React.FC = ({ className, children }) => (
  <div className={cn('flex flex-col gap-2 p-2', className)}>
    {children}
  </div>
);

export default SidebarHeader;