"use client";
import { useState } from "react";
import { useExamRequests } from "@/app/hooks/useExamRequests";
import { CourseSelect } from "@/app/components/CourseSelect";
import { ExamRequestItem } from "@/app/components/ExamRequestItem";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { RejectPopup } from "@/app/components/RejectPopup";
import { ApprovePopup } from "@/app/components/ApprovePopup";
import api from "@/utils/axiosInstance";
import ToastMessage from "@/app/components/ToastMessage";

interface RejectData {
  reason: string;
}

interface ApproveData {
  timeStart: string;
  timeEnd: string;
  assistantId?: string;
  type: string;
  notes?: string;
  roomsId: number[];
}

export default function ProfessorInbox() {
  // Custom hook to manage exam request state
  const {
    courses,
    selectedCourse,
    setSelectedCourse,
    examRequests,
    isLoading,
    error,
    fetchExamRequests,
  } = useExamRequests();

  // State for displaying toast messages
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  // State to handle popup visibility
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showApprovePopup, setShowApprovePopup] = useState(false);

  // Tracks the currently selected exam request ID
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  /**
   * Handles updating an exam request (approval or rejection).
   * @param action - The action to perform ("approve" or "reject").
   * @param data - The data required for the action.
   */
  const handleExamRequestUpdate = async (
    action: "approve" | "reject",
    data: RejectData | ApproveData
  ) => {
    try {
      // Ensure a request ID is selected
      if (!selectedRequestId) return;

      // Perform API request to update the exam request
      const response = await api.put(
        `/event/exam-request/${selectedRequestId}/${action}`,
        data
      );

      // Handle successful response
      if (response.status === 200) {
        setToast({
          message: `Exam request ${action}d successfully`,
          type: "success",
        });
        fetchExamRequests(selectedCourse?.id || null); // Refresh the list of exam requests
      }
    } catch (error: unknown) {
      // Handle API errors
      setToast({
        message:
          error instanceof Error
            ? error.message
            : `${action.charAt(0).toUpperCase() + action.slice(1)} failed`,
        type: "error",
      });
    }
  };

  /**
   * Clears the current toast notification.
   */
  const clearToast = () => setToast(null);

  /**
   * Handles rejecting an exam request.
   * @param reason - The reason for rejection.
   */
  const handleReject = (reason: string) => {
    handleExamRequestUpdate("reject", { reason });
  };

  /**
   * Handles approving an exam request.
   * @param data - The approval data.
   */
  const handleApprove = (data: ApproveData) => {
    handleExamRequestUpdate("approve", data);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* ToastMessage notification */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      {/* Course selection dropdown */}
      <CourseSelect
        courses={courses}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        isLoading={isLoading}
      />

      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* List of exam requests or loading spinner */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {examRequests.map((request) => (
              <ExamRequestItem
                key={request.id}
                request={request}
                setSelectedRequestId={setSelectedRequestId}
                setShowRejectPopup={setShowRejectPopup}
                setShowApprovePopup={setShowApprovePopup}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject popup */}
      {showRejectPopup && (
        <RejectPopup
          isOpen={showRejectPopup}
          onClose={() => setShowRejectPopup(false)}
          onReject={handleReject}
        />
      )}

      {/* Approve popup */}
      {showApprovePopup && selectedRequestId && (
        <ApprovePopup
          isOpen={showApprovePopup}
          onClose={() => setShowApprovePopup(false)}
          courseId={
            examRequests.find((r) => r.id === selectedRequestId)?.courseId || ""
          }
          onApprove={handleApprove}
        />
      )}
    </div>
  );
}
