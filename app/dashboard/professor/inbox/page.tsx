'use client';
import { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import api from '@/utils/axiosInstance';
import Cookies from 'js-cookie';
import { RejectPopup } from '@/app/components/RejectPopup';
import { ApprovePopup } from '@/app/components/ApprovePopup';
import { Toast } from '@/app/components/Toast';

type Course = {
  id: string;
  name: string;
};

type ExamRequest = {
  id: string;
  courseId: string;
  courseName: string;
  groupName: string;
  examDate: string;
  timeStart?: string;
  timeEnd?: string;
  details?: {
    notes?: string;
  } | string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

export default function ProfessorInbox() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Fetch professor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = Cookies.get('userId');
        const response = await api.get(`/course/professor/${userId}`);
        if (response.status === 200) {
          const courseOptions = [
            { value: 'all', label: 'All Courses' },
            ...response.data.map((course: Course) => ({
              value: course.id,
              label: course.name
            }))
          ];
          setCourses(courseOptions);
        }
      } catch (error: unknown) {
        console.log('Failed to load courses', error);
        setError(error instanceof Error ? error.message : 'Failed to load courses');
      }
    };

    fetchCourses();
  }, []);

  const fetchExamRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = Cookies.get('userId');
      const endpoint = selectedCourse && selectedCourse.id !== 'all'
        ? `/event/exam-request/professor/${userId}/course/${selectedCourse.id}`
        : `/event/exam-request/professor/${userId}`;
      
      const response = await api.get(endpoint);
      if (response.status === 200) {
        setExamRequests(response.data);
      }
    } catch (error: unknown) {
      console.log('Failed to load exam requests', error);
      setError(error instanceof Error ? error.message : 'Failed to load exam requests');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    fetchExamRequests();
  }, [fetchExamRequests]);

  const handleConfirm = async (data: {
    timeStart: string;
    timeEnd: string;
    assistantId?: string;
    type: string;
    notes?: string;
  }) => {
    try {
      if (!selectedRequestId) return;
      const response = await api.put(`/event/exam-request/${selectedRequestId}/approve`, data);
      if (response.status === 200) {
        setToastMessage('Exam request approved successfully');
        fetchExamRequests();
      }
    } catch (error: unknown) {
      console.log('Failed to approve exam request', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to approve exam request');
    }
  };

  const handleReject = async (reason: string) => {
    try {
      if (!selectedRequestId) return;
      const response = await api.put(`/event/exam-request/${selectedRequestId}/reject`, { reason });
      if (response.status === 200) {
        setToastMessage('Exam request rejected successfully');
        fetchExamRequests();
      }
    } catch (error: unknown) {
      console.log('Failed to reject exam request', error);
      setToastMessage(error instanceof Error ? error.message : 'Failed to reject exam request');
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
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Course
        </label>
        <Select
          value={selectedCourse}
          onChange={setSelectedCourse}
          options={courses}
          className="w-64"
          placeholder="Select a course..."
          isLoading={isLoading}
          isClearable={false}
        />
      </div>

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
                    <h3 className="font-medium text-lg">{request.courseName}</h3>
                    <p className="text-gray-600">Group: {request.groupName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Group: {request.groupName}</p>
                  <p>Exam Date: {
                    (() => {
                      const baseDate = new Date(request.examDate);
                      if (request.timeStart) {
                        const [hours, minutes] = request.timeStart.split(':');
                        return new Date(baseDate.setHours(parseInt(hours), parseInt(minutes))).toLocaleString();
                      }
                      return baseDate.toLocaleDateString();
                    })()
                  }</p>
                  {request.details && (
                    <p>Details: {
                      typeof request.details === 'string' 
                        ? request.details 
                        : request.details.notes
                    }</p>
                  )}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  {request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRequestId(request.id);
                          setShowApprovePopup(true);
                        }}
                        className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequestId(request.id);
                          setShowRejectPopup(true);
                        }}
                        className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRejectPopup && (
        <RejectPopup
          isOpen={showRejectPopup}
          onClose={() => setShowRejectPopup(false)}
          onReject={handleReject}
        />
      )}

      {showApprovePopup && selectedRequestId && (
        <ApprovePopup
          isOpen={showApprovePopup}
          onClose={() => setShowApprovePopup(false)}
          courseId={examRequests.find(r => r.id === selectedRequestId)?.courseId || ''}
          onApprove={handleConfirm}
        />
      )}
    </div>
  );
}
