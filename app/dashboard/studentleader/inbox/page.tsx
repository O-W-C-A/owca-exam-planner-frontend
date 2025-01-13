'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/axiosInstance';
import Cookies from 'js-cookie';
import { Toast } from '@/app/components/Toast';
import { ExamRequestPopup } from '@/app/components/ExamRequestPopup';

type Event = {
  id: string;
  title: string;
  date: string;
  start: string | null;
  end: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  details: {
    professor: {
      firstName: string;
      lastName: string;
    };
    assistant: {
      firstName: string;
      lastName: string;
    } | null;
    group: string;
    type: string | null;
    notes: string | null;
  };
  courseId: string;
};

export default function StudentLeaderInbox() {
  const [examRequests, setExamRequests] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Event | null>(null);

  const fetchExamRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = Cookies.get('userId');
      const response = await api.get(`/events/student/${userId}`);
      if (response.status === 200) {
        setExamRequests(response.data);
      }
    } catch (error: unknown) {
      console.log('Failed to load exam requests', error);
      setError(error instanceof Error ? error.message : 'Failed to load exam requests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExamRequests();
  }, [fetchExamRequests]);

  const handleUpdate = async (data: {
    date: Date;
    notes: string;
  }) => {
    try {
      if (!selectedRequest) return;
      
      const formattedDate = data.date.toLocaleDateString('en-CA');
      const updateData = {
        examDate: formattedDate,
        details: data.notes,
        status: 'Pending'
      };

      const response = await api.put(`/event/exam-request/${selectedRequest.id}`, updateData);
      if (response.status === 200) {
        setToastMessage('Exam request updated and resubmitted');
        setShowUpdatePopup(false);
        fetchExamRequests();
      }
    } catch (error: unknown) {
      console.log('Failed to update exam request', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to update exam request');
    }
  };

  const formatDateTime = (date: string, start: string | null, end: string | null) => {
    const eventDate = new Date(date);
    const dateStr = eventDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    if (start && end) {
      return `${dateStr} (${start} - ${end})`;
    }
    return dateStr;
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {examRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{request.title}</h3>
                    <p className="text-gray-600">
                      Professor: {request.details.professor.firstName} {request.details.professor.lastName}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusStyles(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    Date: {formatDateTime(request.date, request.start, request.end)}
                  </p>
                  {request.details.type && (
                    <p className="mb-1">Type: {request.details.type}</p>
                  )}
                  {request.details.notes && (
                    <p className="mb-1">Details: {request.details.notes}</p>
                  )}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  {request.status === 'Rejected' && (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowUpdatePopup(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition text-sm"
                    >
                      Update Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpdatePopup && selectedRequest && (
        <ExamRequestPopup
          isOpen={showUpdatePopup}
          onClose={() => setShowUpdatePopup(false)}
          selectedDate={new Date(selectedRequest.date)}
          onSubmit={handleUpdate}
          initialNotes={selectedRequest.details.notes || ''}
          isUpdate={true}
          courseName={selectedRequest.title}
          examId={selectedRequest.id}
        />
      )}
    </div>
  );
}