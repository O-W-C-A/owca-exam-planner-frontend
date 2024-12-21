import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg border-t-4 border-blue-500">
        <h1 className="text-2xl font-bold text-blue-800 text-center">
          Welcome to Your Dashboard
        </h1>
        <p className="text-blue-600 text-center mt-4 leading-relaxed">
          Manage your schedule, track your exams, and access resources in one convenient place.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/dashboard/" className="flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-md transition-transform transform hover:scale-105">
              Go to Dashboard
              <FaArrowRight className="ml-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
