import React from 'react';
import { Separator } from '@/app/components/separator';
import { cn } from '@/utils/cn';

interface SidebarSeparatorProps {
  className?: string;
}

const SidebarSeparator: React.FC<SidebarSeparatorProps> = ({ className }) => (
  <Separator className={cn('mx-2 w-auto bg-sidebar-border', className)} />
);

export default SidebarSeparator;
