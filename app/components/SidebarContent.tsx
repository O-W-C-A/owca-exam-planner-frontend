import React from "react";
import { cn } from "@/utils/cn"; // Assuming this utility is correct

interface SidebarContentProps {
  className?: string;
  children: React.ReactNode;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
      className
    )}
  >
    {children}
  </div>
);

export default SidebarContent;
