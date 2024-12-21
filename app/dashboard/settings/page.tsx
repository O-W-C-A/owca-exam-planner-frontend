// components/SettingsPage.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const role = Cookies.get('role')?.toLowerCase();
    if (role) {
      router.push(`/dashboard/${role}/settings`);
    }
  }, [router]);

  return null;
}
