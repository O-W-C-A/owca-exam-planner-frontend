'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/student/calendar');
  }, [router]);

  return null;
}
