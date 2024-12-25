'use client';
export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg border-t-4 border-yellow-500 text-center">
        <h1 className="text-6xl font-bold text-yellow-500">⚡</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Under Maintenance</h2>
        <p className="text-gray-600 mt-2">
          We&apos;re currently updating our system to serve you better. Please check back soon.
        </p>
        <p className="text-sm text-gray-500 mt-4">Expected downtime: 30 minutes</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
} 