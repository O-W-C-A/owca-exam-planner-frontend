import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/axiosInstance';
import Cookies from 'js-cookie';
import { ExamRequest } from '@/types/examRequest';

export function useEvents(role: 'student' | 'studentleader' | 'professor') {
  const [events, setEvents] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = Cookies.get('userId');
      const response = await api.get(`/event/exam-request/${role}/${userId}`);
      setEvents(response.data);
    } catch (error) {
      setError('Failed to load events');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, mutate: fetchEvents };
} 