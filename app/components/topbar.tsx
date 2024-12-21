'use client';
import { useState, useEffect, useRef } from 'react';
import { LogOut, User } from 'lucide-react';
import Logout from './logout';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

interface TopBarProps {
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({ className }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, userRole, error } = useUser();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={className}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}
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
              ref={buttonRef}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-full bg-gray-50 p-2 hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 pr-2">
                {user ? `${user.firstname} ${user.lastname}` : error || 'Loading...'}
              </span>
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
              <div 
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                {/* White background overlay */}
                <div className="absolute inset-0 bg-white rounded-md" />
                
                {/* Content */}
                <div className="relative">
                  <div className="px-4 py-2 text-sm text-gray-700 bg-white">
                    <div className="font-medium">{user?.firstname}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <div className="border-t border-gray-100" />
                  <a
                    href={`/dashboard/${user?.role}/settings`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Settings
                  </a>
                </div>
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
