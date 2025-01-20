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
  // States to manage courses, selected course, and exam requests
  const [courses, setCourses] = useState<Course[]>([]); // List of courses available for professors
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // Selected course for filtering exam requests
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]); // List of exam requests based on user role
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetch operations
  const [error, setError] = useState<string | null>(null); // Error state for fetch operations

  // Fetch courses for professors when the component mounts
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

  // Fetch exam requests based on user role and selected course
  const fetchExamRequests = useCallback(async (courseId: string | null) => {
    try {
      setIsLoading(true); // Set loading state to true before fetch
      const userId = Cookies.get("userId");
      const userRole = Cookies.get("role");

      let endpoint = '';
      // Determine endpoint based on user role (Student, Student Leader, or Professor)
      if (userRole === UserType.Student || userRole === UserType.StudentLeader) {
        endpoint = `/exam-requests/student/${userId}`;
      } else if (userRole === UserType.Professor) {
        // Fetch exam requests for a professor, either for all courses or a specific course
        if (courseId === "all" || courseId === null) {
          endpoint = `/exam-requests/professor/${userId}`;
        } else {
          endpoint = `/exam-requests/professor/${userId}/course/${courseId}`;
        }
      }

      const response = await api.get(endpoint);
      if (response.status === 200) {
        // Parse and map exam requests to include start/end times and confirmation status
        const parsedExamRequests = response.data.map((event: ExamRequest) => {
          const { start, end } = parseEventDate(event.date, event.start, event.end);
          return {
            ...event,
            start,
            end,
            isConfirmed: event.status === "Approved", // Flag if exam request is approved
          };
        });
        setExamRequests(parsedExamRequests); // Set the fetched exam requests
      }
    } catch (error) {
      console.error("Failed to load exam requests", error);
      setError(error instanceof Error ? error.message : "Failed to load exam requests");
    } finally {
      setIsLoading(false); // Reset loading state after fetch is complete
    }
  }, [selectedCourse]);

  // Fetch initial data when component mounts for professors
  useEffect(() => {
    const userRole = Cookies.get("role");
    if (userRole === UserType.Professor) {
      fetchCourses(); // Fetch courses if the user is a professor
    }
  }, [fetchCourses]); // No need to depend on `selectedCourse` here

  // Fetch exam requests whenever the selected course changes
  useEffect(() => {
    fetchExamRequests(selectedCourse?.id || null); // Fetch exam requests based on the selected course
  }, [fetchExamRequests, selectedCourse]); // Add `selectedCourse` as dependency

  return {
    courses, // List of courses for professors
    selectedCourse, // The currently selected course
    setSelectedCourse, // Setter function to change the selected course
    examRequests, // List of exam requests based on the user role
    isLoading, // State indicating if data is still loading
    error, // Error message in case of a failure
    fetchCourses, // Function to fetch courses for professors
    fetchExamRequests, // Function to fetch exam requests based on user role
    setExamRequests, // Setter function to update the exam requests
  };
};
