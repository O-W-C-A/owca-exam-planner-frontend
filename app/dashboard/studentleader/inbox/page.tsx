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
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ToastMessageState, setToastMessage] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExamRequest | null>(
    null
  );

  // Function to fetch exam requests from the API
  const fetchExamRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = Cookies.get("userId"); // Get user ID from cookies
      const response = await api.get(`/exam-requests/student/${userId}`);

      // If the request is successful, update the state with the exam requests
      if (response.status === 200) {
        setExamRequests(response.data);
      }
    } catch (error: unknown) {
      // Handle errors if the request fails
      setError(
        error instanceof Error ? error.message : "Failed to load exam requests"
      );
    } finally {
      setIsLoading(false); // Set loading to false after request completion
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

      const formattedDate = data.date.toLocaleDateString("en-CA"); // Format the date
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
        setToastMessage("Exam request updated and resubmitted");
        setShowUpdatePopup(false);
        fetchExamRequests();
      }
    } catch (error: unknown) {
      // Handle errors if the update request fails
      setToastMessage(
        error instanceof Error ? error.message : "Failed to update exam request"
      );
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Toast message to show feedback on actions */}
      {ToastMessageState && (
        <ToastMessage
          message={ToastMessageState}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* List of exam requests */}
      <div className="flex-1 overflow-auto">
        <ExamRequestList
          examRequests={examRequests}
          isLoading={isLoading}
          error={error}
          onUpdateClick={(request) => {
            setSelectedRequest(request); // Set selected request for updating
            setShowUpdatePopup(true); // Show update popup
          }}
        />
      </div>

      {/* Exam request update popup */}
      {showUpdatePopup && selectedRequest && (
        <ExamRequestPopup
          isOpen={showUpdatePopup}
          onClose={() => setShowUpdatePopup(false)} // Close the popup
          selectedDate={new Date(selectedRequest.date)} // Set the initial date
          onSubmit={handleUpdate} // Submit the update
          initialNotes={selectedRequest.details.notes || ""} // Initial notes for the request
          isUpdate={true} // Indicate this is an update
          courseName={selectedRequest.title} // Set course name in the popup
          examId={selectedRequest.id} // Set the exam ID
        />
      )}
    </div>
  );
}
