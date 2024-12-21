import React from 'react';
import { Separator } from './Separator'; // Assuming Separator component is correct
import { cn } from '@/utils/cn'; // Assuming this utility is correct

const SidebarSeparator: React.FC = ({ className, children }) => (
  <Separator className={cn('mx-2 w-auto bg-sidebar-border', className)} />
);

export default SidebarSeparator;
