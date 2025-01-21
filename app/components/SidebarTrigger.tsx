import React from "react";
import { Button } from "@/app/components/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/utils/cn";

interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {
  className?: string;
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-6 w-6 p-0", className)}
        onClick={onClick}
        {...props}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  }
);

SidebarTrigger.displayName = "SidebarTrigger";
export default SidebarTrigger;
