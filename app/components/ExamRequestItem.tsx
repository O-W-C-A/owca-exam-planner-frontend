import { ExamRequest } from "@/types/examRequest";
import { formatDateTime, getStatusStyles } from "@/utils/helpers";

interface ExamRequestItemProps {
  request: ExamRequest;
  setSelectedRequestId: (id: string) => void;
  setShowRejectPopup: (show: boolean) => void;
  setShowApprovePopup: (show: boolean) => void;
}

export function ExamRequestItem({
  request,
  setSelectedRequestId,
  setShowRejectPopup,
  setShowApprovePopup,
}: ExamRequestItemProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-lg">{request.title}</h3>
          <p className="text-gray-600">Group: {request.details.group}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-sm ${getStatusStyles(
            request.status
          )}`}
        >
          {request.status}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <p className="mb-1">Date: {formatDateTime(request.date)}</p>
        {request.details.type && (
          <p className="mb-1">Type: {request.details.type}</p>
        )}
        {request.details.notes && (
          <p className="mb-1">Details: {request.details.notes}</p>
        )}
      </div>
      {request.status === "Pending" && (
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => {
              setSelectedRequestId(request.id);
              setShowRejectPopup(true);
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition text-sm"
          >
            Reject
          </button>
          <button
            onClick={() => {
              setSelectedRequestId(request.id);
              setShowApprovePopup(true);
            }}
            className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition text-sm"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}
