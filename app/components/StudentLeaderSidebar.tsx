import { Calendar, Inbox } from "lucide-react";
import { Sidebar } from "@/app/components/sidebar";

const studentLeaderNavItems = [
  {
    title: "Calendar",
    href: "/dashboard/studentleader/calendar",
    icon: Calendar,
  },
  {
    title: "Inbox",
    href: "/dashboard/studentleader/inbox",
    icon: Inbox,
  },
];

export function StudentLeaderSidebar() {
  return <Sidebar navItems={studentLeaderNavItems} />;
}
