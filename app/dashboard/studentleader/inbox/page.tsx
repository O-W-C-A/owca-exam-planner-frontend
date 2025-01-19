"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/axiosInstance";
import Cookies from "js-cookie";
import { Toast } from "@/app/components/Toast";
import { ExamRequestPopup } from "@/app/components/ExamRequestPopup";
import ExamRequestList from "@/app/components/ExamRequestList";
import { ExamRequest, ExamRequestFormData } from "@/types/examRequest";

export default function StudentLeaderInbox() {
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExamRequest | null>(null);

  const fetchExamRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = Cookies.get("userId");
      const response = await api.get(`/exam-requests/student/${userId}`);
      if (response.status === 200) {
        setExamRequests(response.data);
      }
    } catch (error: unknown) {
      console.log("Failed to load exam requests", error);
      setError(
        error instanceof Error ? error.message : "Failed to load exam requests"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExamRequests();
  }, [fetchExamRequests]);

  const handleUpdate = async (data: ExamRequestFormData) => {
    try {
      if (!selectedRequest) return;

      const formattedDate = data.date.toLocaleDateString("en-CA");
      const updateData = {
        examDate: formattedDate,
        details: data.notes,
        status: "Pending",
      };

      const response = await api.put(
        `/event/exam-request/${selectedRequest.id}`,
        updateData
      );
      if (response.status === 200) {
        setToastMessage("Exam request updated and resubmitted");
        setShowUpdatePopup(false);
        fetchExamRequests();
      }
    } catch (error: unknown) {
      console.log("Failed to update exam request", error);
      setToastMessage(
        error instanceof Error ? error.message : "Failed to update exam request"
      );
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
      <div className="flex-1 overflow-auto">
        <ExamRequestList
          examRequests={examRequests}
          isLoading={isLoading}
          error={error}
          onUpdateClick={(request) => {
            setSelectedRequest(request);
            setShowUpdatePopup(true);
          }}
        />
      </div>
      {showUpdatePopup && selectedRequest && (
        <ExamRequestPopup
          isOpen={showUpdatePopup}
          onClose={() => setShowUpdatePopup(false)}
          selectedDate={new Date(selectedRequest.date)}
          onSubmit={handleUpdate}
          initialNotes={selectedRequest.details.notes || ""}
          isUpdate={true}
          courseName={selectedRequest.title}
          examId={selectedRequest.id}
        />
      )}
    </div>
  );
}
