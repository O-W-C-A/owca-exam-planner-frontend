'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentLeaderPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/studentleader/calendar');
  }, [router]);

  return null;
}
