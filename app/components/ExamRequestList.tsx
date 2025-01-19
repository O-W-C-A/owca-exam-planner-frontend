import React from "react";
import ExamRequestCard from "@/app/components/ExamRequestCard";
import { ExamRequest } from "@/types/examRequest";

type ExamRequestListProps = {
  examRequests: ExamRequest[];
  isLoading: boolean;
  error: string | null;
  onUpdateClick: (request: ExamRequest) => void;
};

const ExamRequestList: React.FC<ExamRequestListProps> = ({
  examRequests,
  isLoading,
  error,
  onUpdateClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {examRequests.map((request) => (
        <ExamRequestCard key={request.id} request={request} onUpdateClick={onUpdateClick} />
      ))}
    </div>
  );
};

export default ExamRequestList;
