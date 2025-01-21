import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import api from "@/utils/axiosInstance";
import { ExamRequest } from "@/types/examRequest";
import { Course } from "@/types/course";
import { UserType } from "@/types/userType";

// Utility function to parse event date and time, with default duration of 2 hours
const parseEventDate = (date: string, start: string | undefined | null, end: string | undefined | null) => {
  const eventDate = new Date(date); // Parse the base event date
  const startDate = new Date(eventDate);
  const [startHours, startMinutes] = start?.split(":") || []; // Extract hours and minutes from start time
  if (startHours && startMinutes) {
    startDate.setHours(parseInt(startHours), parseInt(startMinutes)); // Set the start time
  }

  const endDate = new Date(eventDate);
  const [endHours, endMinutes] = end?.split(":") || []; // Extract hours and minutes from end time
  if (endHours && endMinutes) {
    endDate.setHours(parseInt(endHours), parseInt(endMinutes)); // Set the end time if provided
  } else {
    endDate.setHours(startDate.getHours() + 2); // Default duration is 2 hours
  }

  return { start: startDate, end: endDate };
};

export const useExamRequests = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses for professors when the component mounts
  const fetchCourses = useCallback(async () => {
    try {
      const userId = Cookies.get("userId");
      const response = await api.get(`/course/professor/${userId}`);
      if (response.status === 200) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error("Failed to load courses", error);
      setError(error instanceof Error ? error.message : "Failed to load courses");
    }
  }, []); // No dependencies, will only run on component mount

  // Fetch exam requests based on user role and selected course
  const fetchExamRequests = useCallback(async (courseId: string | null) => {
    try {
      setIsLoading(true);
      const userId = Cookies.get("userId");
      const userRole = Cookies.get("role");

      let endpoint = '';
      if (userRole === UserType.Student || userRole === UserType.StudentLeader) {
        endpoint = `/events/student/${userId}`;
      } else if (userRole === UserType.Professor) {
        if (courseId === "all" || courseId === null) {
          endpoint = `/event/exam-request/professor/${userId}`;
        } else {
          endpoint = `/event/exam-request/professor/${userId}/course/${courseId}`;
        }
      }

      const response = await api.get(endpoint);
      if (response.status === 200) {
        const parsedExamRequests = response.data.map((event: ExamRequest) => {
          const { start, end } = parseEventDate(event.date, event.start, event.end);
          return {
            ...event,
            start,
            end,
            isConfirmed: event.status === "Approved",
          };
        });
        setExamRequests(parsedExamRequests);
      }
    } catch (error) {
      console.error("Failed to load exam requests", error);
      setError(error instanceof Error ? error.message : "Failed to load exam requests");
    } finally {
      setIsLoading(false);
    }
  }, []); // Now no need to depend on `selectedCourse` here

  // Fetch initial data when component mounts for professors
  useEffect(() => {
    const userRole = Cookies.get("role");
    if (userRole === UserType.Professor) {
      fetchCourses();
    }
  }, [fetchCourses]);

  // Fetch exam requests whenever the selected course changes
  useEffect(() => {
    fetchExamRequests(selectedCourse?.id || null); // Fetch exam requests based on selected course
  }, [fetchExamRequests, selectedCourse]); // Keep `selectedCourse` here

  return {
    courses,
    selectedCourse,
    setSelectedCourse,
    examRequests,
    isLoading,
    error,
    fetchCourses,
    fetchExamRequests,
    setExamRequests,
  };
};
