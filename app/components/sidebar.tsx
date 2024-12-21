import React from 'react';
import { useSidebar } from '@/app/components/SidebarContext';
import { Sheet, SheetContent } from '@/app/components/sheet'; // assuming these components are imported correctly

const Sidebar: React.FC = ({ children }) => {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent className="w-[--sidebar-width] bg-sidebar">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden md:block"
      data-state={state}
    >
      <div className="fixed inset-y-0 z-10 w-[--sidebar-width]">
        <div className="flex flex-col bg-sidebar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
