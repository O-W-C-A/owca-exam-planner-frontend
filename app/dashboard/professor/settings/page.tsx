// components/SettingsPage.tsx
'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import api from '@/utils/axiosInstance';
import { Toast } from '@/app/components/Toast';
import Cookies from 'js-cookie';

type ProfessorDetails = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
};

export default function ProfessorSettings() {
  const { user } = useUser();
  const [details, setDetails] = useState<ProfessorDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessorDetails = async () => {
      try {
        setIsLoading(true);
        const userId = user?.id || Cookies.get('userId');
        console.log('Fetching details for user:', userId);
        
        const response = await api.get(`/users/professor/${userId}`);
        
        if (response.status === 200) {
          const data = response.data;
          setDetails({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            department: data.department || '',
            title: data.title || ''
          });
        }
      } catch (error) {
        console.error('Error fetching professor details:', error);
        setToastMessage('Failed to load professor details');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id || Cookies.get('userId')) {
      fetchProfessorDetails();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/professor/${user?.id}`, details);
      if (response.status === 200) {
        setToastMessage('Settings updated successfully');
      }
    } catch (error) {
      setToastMessage('Failed to update settings');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between py-4 px-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>

      <div className="flex-1 px-8 pb-6">
        <div className="h-full bg-white rounded-lg border shadow-sm">
          <div className="h-full p-8 flex flex-col">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 pb-6 border-b">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-semibold text-gray-600">
                {details?.firstName?.[0]}{details?.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {details?.firstName} {details?.lastName}
                </h2>
                <p className="text-lg text-gray-600">{details?.title}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 grid grid-cols-2 gap-8 pt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-2 text-lg">{details?.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="mt-2 text-lg">{details?.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Academic Title</label>
                    <p className="mt-2 text-lg">{details?.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
