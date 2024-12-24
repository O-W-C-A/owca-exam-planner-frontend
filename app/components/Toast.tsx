'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

type ToastProps = {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
};

export function Toast({ message, type = 'error', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-2 ${
        type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`}>
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 