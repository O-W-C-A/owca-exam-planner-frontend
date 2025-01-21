"use client";
import { useState } from "react";
import { useExamRequests } from "@/app/hooks/useExamRequests"; 
import  ToastMessage  from "@/app/components/ToastMessage";
import { CourseSelect } from "@/app/components/CourseSelect";
import { ExamRequestItem } from "@/app/components/ExamRequestItem";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { RejectPopup } from "@/app/components/RejectPopup";
import { ApprovePopup } from "@/app/components/ApprovePopup";

export default function ProfessorInbox() {
  const {
    courses,
    selectedCourse,
    setSelectedCourse,
    examRequests,
    isLoading,
    error,
    fetchExamRequests,
  } = useExamRequests(); 

  const [ToastMessage, setToastMessage] = useState<string | null>(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleExamRequestUpdate = async (action: 'approve' | 'reject', data: any) => {
    try {
      if (!selectedRequestId) return;

      const response = await api.put(
        `/event/exam-request/${selectedRequestId}/${action}`,
        data
      );

      if (response.status === 200) {
        setToastMessage(`Exam request ${action}d successfully`);
        fetchExamRequests(selectedCourse?.id || null);
      }
    } catch (error: unknown) {
      console.error(`${action.charAt(0).toUpperCase() + action.slice(1)} failed`, error);
      setToastMessage(
        error instanceof Error ? error.message : `${action.charAt(0).toUpperCase() + action.slice(1)} failed`
      );
    }
  };

  const handleReject = (reason: string) => {
    handleExamRequestUpdate('reject', { reason });
  };

  const handleApprove = (data: {
    timeStart: string;
    timeEnd: string;
    assistantId?: string;
    type: string;
    notes?: string;
    roomsId: number[];
  }) => {
    handleExamRequestUpdate('approve', data);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {ToastMessage && (
        <ToastMessage message={ToastMessage} onClose={() => setToastMessage(null)} />
      )}

      <CourseSelect
        courses={courses}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        isLoading={isLoading}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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

      {showRejectPopup && (
        <RejectPopup
          isOpen={showRejectPopup}
          onClose={() => setShowRejectPopup(false)}
          onReject={handleReject}
        />
      )}

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
