'use client';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '@/utils/axiosInstance';
import Cookies from 'js-cookie';

type Course = {
  value: string;  // course id
  label: string;  // course name
};

type ExamRequest = {
  id: string;
  courseId: string;
  courseName: string;
  groupName: string;
  date: string;
  start?: string;
  end?: string;
  details: {
    group: string;
    notes?: string;
  };
  status: 'Pending' | 'Approved' | 'Rejected';
};

export default function ProfessorInbox() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch professor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = Cookies.get('userId');
        const response = await api.get(`/course/professor/${userId}`);
        if (response.status === 200) {
          const courseOptions = [
            { value: 'all', label: 'All Courses' },
            ...response.data.map((course: any) => ({
              value: course.id,
              label: course.name
            }))
          ];
          setCourses(courseOptions);
        }
      } catch (error) {
        setError('Failed to load courses');
      }
    };

    fetchCourses();
  }, []);

  // Fetch exam requests based on selected course
  useEffect(() => {
    const fetchExamRequests = async () => {
      try {
        setIsLoading(true);
        const userId = Cookies.get('userId');
        const endpoint = selectedCourse && selectedCourse.value !== 'all'
          ? `/event/exam-request/professor/${userId}/course/${selectedCourse.value}`
          : `/event/exam-request/professor/${userId}`;
        
        const response = await api.get(endpoint);
        if (response.status === 200) {
          setExamRequests(response.data);
        }
      } catch (error) {
        setError('Failed to load exam requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamRequests();
  }, [selectedCourse]);

  const handleConfirm = async (eventId: string) => {
    try {
      const response = await api.put(`/event/exam-request/${eventId}/approve`);
      if (response.status === 200) {
        setToastMessage('Exam request approved successfully');
        fetchExamRequests();
      }
    } catch (error) {
      setToastMessage('Failed to approve exam request');
    }
  };

  const handleReject = async (eventId: string) => {
    try {
      const response = await api.put(`/event/exam-request/${eventId}/reject`);
      if (response.status === 200) {
        setToastMessage('Exam request rejected successfully');
        fetchExamRequests();
      }
    } catch (error) {
      setToastMessage('Failed to reject exam request');
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
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
          <div className="space-y-2">
            {examRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{request.courseName}</h3>
                    <span className="text-sm text-gray-500">• {request.details?.group}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Exam Date: {
                    (() => {
                      const baseDate = new Date(request.date);
                      if (request.start) {
                        const [hours, minutes] = request.start.split(':');
                        const date = new Date(baseDate);
                        date.setHours(parseInt(hours), parseInt(minutes));
                        return date.toLocaleString();
                      }
                      return baseDate.toLocaleDateString();
                    })()
                  }</p>
                  {request.details?.notes && (
                    <p className="truncate">Details: {request.details.notes}</p>
                  )}
                </div>
                <div className="flex justify-end mt-2 space-x-2">
                  {request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleConfirm(request.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
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
    </div>
  );
}
