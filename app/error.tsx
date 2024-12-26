'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg border-t-4 border-red-500 text-center">
        <h1 className="text-6xl font-bold text-red-500">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Something went wrong!</h2>
        <p className="text-gray-600 mt-2">Our team has been notified and is working on the issue.</p>
        <div className="mt-6 space-x-4">
          <button
            onClick={reset}
            className="inline-block px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="inline-block px-6 py-3 text-blue-500 border border-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
} 