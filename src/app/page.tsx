import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import Calendar from './components/Calendar';

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div>
          {/* <a href="/login">Login</a>
          <a href="/calendar">Calendar</a> */}
          <Calendar />
        </div>
      </main>
    </SidebarProvider>
  );
}
