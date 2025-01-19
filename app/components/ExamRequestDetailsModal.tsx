import React from "react";
import { ExamRequest } from "@/types/examRequest";
import { getExamRequestStatusStyles } from "@/utils/examRequestUtils";

interface ExamRequestDetailsModalProps {
  examRequest: ExamRequest;
  onClose: () => void;
}

const ExamRequestDetailsModal: React.FC<ExamRequestDetailsModalProps> = ({
  examRequest,
  onClose,
}) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
      <h2 className="text-xl font-bold mb-4">
        {examRequest.title}
        <span
          className={`ml-2 px-2 py-1 text-sm rounded ${getExamRequestStatusStyles(
            examRequest.status
          )}`}
        >
          {examRequest.status}
        </span>
      </h2>

      <div>{/* Render ExamRequest Details */}</div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ExamRequestDetailsModal;
