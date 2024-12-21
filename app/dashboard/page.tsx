'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('authToken');
    const role = Cookies.get('role');

    if (!token || !role) {
      router.push('/login');
      return;
    }

    // Convert role to lowercase for URL consistency
    const userType = role.toLowerCase();
    
    // Only redirect students to student dashboard
    if (userType === 'student') {
      router.push('/dashboard/student');
    } else {
      // For other roles, stay on their respective dashboards
      router.push(`/dashboard/${userType}`);
    }
  }, [router]);

  // Return null or a loading state while redirecting
  return null;
} 