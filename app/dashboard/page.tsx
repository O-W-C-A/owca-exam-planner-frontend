'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('authToken');
    const role = Cookies.get('role')?.toLowerCase();

    if (!token || !role) {
      router.push('/login');
      return;
    }

    // Convert role to lowercase for URL consistency
    const userType = role.toLowerCase();
    
    // Handle different roles
    switch (userType) {
      case 'student':
        router.push('/dashboard/student/calendar');
        break;
      case 'studentleader':
        router.push('/dashboard/studentleader/calendar');
        break;
      case 'professor':
        router.push('/dashboard/professor/calendar');
        break;
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'secretary':
        router.push('/dashboard/secretary');
        break;
      default:
        router.push('/dashboard');
    }
  }, [router]);

  // Return null or a loading state while redirecting
  return null;
} 