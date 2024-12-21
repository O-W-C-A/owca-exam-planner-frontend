'use client';
import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import Logout from './logout';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface TopBarProps {
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({ className }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Or a loading state
  }

  // Get user role from cookies
  const userRole = Cookies.get('role')?.toLowerCase() || 'student';

  return (
    <div className={className}>
      <div className="w-full bg-white border-b border-gray-200 px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Brand/Logo */}
          <div className="flex items-center">
            <Link 
              href={`/dashboard/${userRole}`}
              className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ExamPlanner
            </Link>
          </div>

          {/* Right side - Profile & Actions */}
          <div className="relative flex items-center gap-2">
            {/* User Profile Button */}
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-full bg-gray-50 p-2 hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 pr-2">John Doe</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => setShowPopup(true)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2",
                "bg-white text-gray-700 hover:bg-gray-50",
                "border border-gray-200 transition-colors"
              )}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <div className="font-medium">John Doe</div>
                  <div className="text-gray-500">john@example.com</div>
                </div>
                <div className="border-t border-gray-100" />
                <a
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Popup */}
      {showPopup && (
        <Logout showPopup={showPopup} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default TopBar;
