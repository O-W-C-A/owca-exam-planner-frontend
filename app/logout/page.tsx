'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Logout from '../components/logout';

export default function LogOut() {
  const [showPopup, setShowPopup] = useState(true);
  const router = useRouter();

  const confirmLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('role');
    Cookies.remove('userId');

    router.push('/login');
  };

  const cancelLogout = () => {
    setShowPopup(false);
  };

  return (
    <Logout
        showPopup={showPopup}
        confirmLogout={confirmLogout}
        cancelLogout={cancelLogout}
        />
  );
}
