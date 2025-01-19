import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "@/utils/axiosInstance";
import { ExamRequest } from "@/types/examRequest";

export const useExamRequests = () => {
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch exam requests function moved outside of useEffect
  const fetchExamRequests = async () => {
    try {
      const userId = Cookies.get("userId");
      const response = await api.get(`exam-requests/student/${userId}`);
      if (response.status === 200) {
        const parsedExamRequests = response.data.map((event: ExamRequest) => {
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
            endDate.setHours(startDate.getHours() + 2);
          }

          return {
            ...event,
            start: startDate,
            end: endDate,
            isConfirmed: event.status === "Approved",
          };
        });
        setExamRequests(parsedExamRequests);
      }
    } catch (error) {
      console.log("Failed to load exam requests. Please try again.", error);
      setError(
        error instanceof Error ? error.message : "Failed to load events"
      );
      setExamRequests([]);
    }
  };

  // Call fetchExamRequests once on component mount
  useEffect(() => {
    fetchExamRequests();
  }, []); // Empty dependency array, so it only runs once

  return { examRequests, error, refetch: fetchExamRequests }; // Now fetchExamRequests is in scope
};
