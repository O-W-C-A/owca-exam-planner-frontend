import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg border-t-4 border-red-500 text-center">
        <h1 className="text-6xl font-bold text-red-500">401</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Unauthorized Access</h2>
        <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        <div className="mt-6 space-x-4">
          <Link 
            href="/login"
            className="inline-block px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Login
          </Link>
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