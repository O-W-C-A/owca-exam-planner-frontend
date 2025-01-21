"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/axiosInstance";
import Cookies from "js-cookie";
import ToastMessage from "@/app/components/ToastMessage";
import { ExamRequestPopup } from "@/app/components/ExamRequestPopup";
import ExamRequestList from "@/app/components/ExamRequestList";
import { ExamRequest, ExamRequestFormData } from "@/types/examRequest";

export default function StudentLeaderInbox() {
  // State variables to manage exam requests, loading state, error messages, and other UI states
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]); // Holds the list of exam requests
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState<string | null>(null); // Tracks error message if any
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null); // Holds the toast notification state
  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // Controls visibility of the update popup
  const [selectedRequest, setSelectedRequest] = useState<ExamRequest | null>(null); // Holds the currently selected exam request for update

  // Function to fetch exam requests from the API
  const fetchExamRequests = useCallback(async () => {
    try {
      setIsLoading(true); // Set loading state to true before API request
      const userId = Cookies.get("userId"); // Get user ID from cookies
      const response = await api.get(`/events/student/${userId}`); // Fetch exam requests for the user

      // If the request is successful, update the state with the fetched exam requests
      if (response.status === 200) {
        setExamRequests(response.data); // Set the exam request data to the state
      }
    } catch (error: unknown) {
      // Handle errors if the request fails
      setError(
        error instanceof Error ? error.message : "Failed to load exam requests"
      ); // Set a meaningful error message
    } finally {
      setIsLoading(false); // Set loading state to false after request completion
    }
  }, []);

  // Fetch exam requests on initial component mount
  useEffect(() => {
    fetchExamRequests();
  }, [fetchExamRequests]);

  // Function to handle the update of an exam request
  const handleUpdate = async (data: ExamRequestFormData) => {
    try {
      if (!selectedRequest) return; // Ensure a request is selected before updating

      const formattedDate = data.date.toLocaleDateString("en-CA"); // Format the date as YYYY-MM-DD
      const updateData = {
        examDate: formattedDate,
        details: data.notes,
        status: "Pending", // Set status as Pending during update
      };

      const response = await api.put(
        `/event/exam-request/${selectedRequest.id}`,
        updateData
      );

      // If update is successful, display success message and refresh the list of requests
      if (response.status === 200) {
        setToast({
          message: "Exam request updated and resubmitted", // Success message
          type: "success", // Toast type set to success
        });
        setShowUpdatePopup(false); // Close the update popup
        fetchExamRequests(); // Refresh the list of exam requests
      }
    } catch (error: unknown) {
      // Handle errors if the update request fails
      setToast({
        message: error instanceof Error ? error.message : "Failed to update exam request",
        type: "error", // Toast type set to error
      });
    }
  };

  // Clear toast message when closed
  const clearToast = () => setToast(null);

  return (
    <div className="h-full flex flex-col p-6">
      {/* ToastMessage notification */}
      {toast && (
        <ToastMessage
          message={toast.message} // Display the toast message
          type={toast.type} // Set the toast type (success, error, or info)
          onClose={clearToast} // Clear the toast on close
        />
      )}

      {/* List of exam requests */}
      <div className="flex-1 overflow-auto">
        <ExamRequestList
          examRequests={examRequests} // Pass the list of exam requests to the component
          isLoading={isLoading} // Pass loading state to show loading indicator
          error={error} // Pass any error message to display an error
          onUpdateClick={(request) => {
            setSelectedRequest(request); // Set the selected request for updating
            setShowUpdatePopup(true); // Show update popup
          }}
        />
      </div>

      {/* Exam request update popup */}
      {showUpdatePopup && selectedRequest && (
        <ExamRequestPopup
          isOpen={showUpdatePopup} // Show the update popup
          onClose={() => setShowUpdatePopup(false)} // Close the update popup when clicked
          selectedDate={new Date(selectedRequest.date)} // Set the initial date from the selected request
          onSubmit={handleUpdate} // Submit the update when the form is submitted
          initialNotes={selectedRequest.details.notes || ""} // Initial notes for the request
          courseName={selectedRequest.title} // Set the course name in the popup
          examId={selectedRequest.id} // Set the exam ID for the request
        />
      )}
    </div>
  );
}
