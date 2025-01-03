import { useState, useCallback } from 'react';
import api from '@/utils/axiosInstance';
import Cookies from 'js-cookie';
import { ExamRequest } from '@/types/examRequest';
import { Course } from '@/types/course';

export function useExamRequests() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await api.get(`/course/professor/${userId}`);
      if (response.status === 200) {
        setCourses(response.data);
      }
    } catch (error: unknown) {
      console.error('Failed to load courses', error);
      setError(error instanceof Error ? error.message : 'Failed to load courses');
    }
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
      console.error('Failed to load exam requests', error);
      setError(error instanceof Error ? error.message : 'Failed to load exam requests');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse]);

  return {
    courses,
    selectedCourse,
    setSelectedCourse,
    examRequests,
    isLoading,
    error,
    fetchCourses,
    fetchExamRequests
  };
} 