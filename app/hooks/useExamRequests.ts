import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import api from "@/utils/axiosInstance";
import { ExamRequest } from "@/types/examRequest";
import { Course } from "@/types/course";
import { UserType } from "@/types/userType";

export const useExamRequests = () => {
  // State hooks to manage courses, exam requests, and loading/error states
  const [courses, setCourses] = useState<Course[]>([]); // List of courses available to the user (professor only)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // Selected course for filtering exam requests (professor only)
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]); // List of exam requests for the user
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetch operations
  const [error, setError] = useState<string | null>(null); // Error state for fetch operations

  // Fetch courses for professors (only relevant for professors)
  const fetchCourses = useCallback(async () => {
    try {
      const userId = Cookies.get("userId");
      const response = await api.get(`/course/professor/${userId}`);
      if (response.status === 200) {
        setCourses(response.data); // Set courses for the professor
      }
    } catch (error) {
      console.error("Failed to load courses", error);
      setError(error instanceof Error ? error.message : "Failed to load courses");
    }
  }, []);

  // Fetch exam requests based on the user's role (student, student leader, or professor)
  const fetchExamRequests = useCallback(async () => {
    try {
      setIsLoading(true); // Set loading to true before starting fetch
      const userId = Cookies.get("userId");
      const userRole = Cookies.get("role");

      // For students and student leaders, fetch their specific exam requests
      if (userRole === UserType.Student || userRole === UserType.StudentLeader) {
        const response = await api.get(`/exam-requests/student/${userId}`);
        if (response.status === 200) {
          const parsedExamRequests = response.data.map((event: ExamRequest) => {
            // Parse event times and dates
            const eventDate = new Date(event.date);
            const startDate = new Date(eventDate);
            const [startHours, startMinutes] = event.start?.split(":") || [];
            if (startHours && startMinutes) {
              startDate.setHours(parseInt(startHours), parseInt(startMinutes));
            }

            const endDate = new Date(eventDate);
            const [endHours, endMinutes] = event.end?.split(":") || [];
            if (endHours && endMinutes) {
              endDate.setHours(parseInt(endHours), parseInt(endMinutes));
            } else {
              endDate.setHours(startDate.getHours() + 2); // Default duration is 2 hours
            }

            return {
              ...event,
              start: startDate,
              end: endDate,
              isConfirmed: event.status === "Approved", // Flag if the exam request is approved
            };
          });
          setExamRequests(parsedExamRequests);
        }
      } else if (userRole === UserType.Professor) {
        // Professors fetch exam requests for their courses
        const courseId = selectedCourse ? selectedCourse.id : null;
        const endpoint = courseId
          ? `/exam-requests/professor/${userId}/course/${courseId}`
          : `/exam-requests/professor/${userId}`;
        
        const response = await api.get(endpoint);

        if (response.status === 200) {
          const parsedExamRequests = response.data.map((event: ExamRequest) => {
            // Parse event times and dates for professors' exam requests
            const eventDate = new Date(event.date);
            const startDate = new Date(eventDate);
            const [startHours, startMinutes] = event.start?.split(":") || [];
            if (startHours && startMinutes) {
              startDate.setHours(parseInt(startHours), parseInt(startMinutes));
            }

            const endDate = new Date(eventDate);
            const [endHours, endMinutes] = event.end?.split(":") || [];
            if (endHours && endMinutes) {
              endDate.setHours(parseInt(endHours), parseInt(endMinutes));
            } else {
              endDate.setHours(startDate.getHours() + 2); // Default duration is 2 hours
            }

            return {
              ...event,
              start: startDate,
              end: endDate,
              isConfirmed: event.status === "Approved", // Flag if the exam request is approved
            };
          });
          setExamRequests(parsedExamRequests);
        }
      } else {
        console.warn("Unrecognized user role");
      }
    } catch (error) {
      console.error("Failed to load exam requests", error);
      setError(error instanceof Error ? error.message : "Failed to load exam requests");
    } finally {
      setIsLoading(false); // Reset loading state after fetch completes
    }
  }, [selectedCourse]);

  // Fetch initial data on component mount based on user role
  useEffect(() => {
    const userRole = Cookies.get("role");
    if (userRole === UserType.Professor || userRole === "professor") {
      fetchCourses(); // Professors fetch courses only
    }
    fetchExamRequests(); // Always fetch exam requests based on role
  }, [fetchCourses, fetchExamRequests]);

  return {
    courses, // List of courses for professors
    selectedCourse, // Selected course (for filtering exam requests)
    setSelectedCourse, // Setter function for selected course
    examRequests, // List of exam requests based on user role
    isLoading, // Loading state for fetching data
    error, // Error state for fetch operations
    fetchCourses, // Function to fetch courses for professors
    fetchExamRequests, // Function to fetch exam requests based on role
    setExamRequests, // Setter function for exam requests
  };
};
