import React from "react";
import { formatDateTime, getStatusStyles } from "@/utils/helpers";
import { ExamRequest } from "@/types/examRequest";

type ExamRequestCardProps = {
  request: ExamRequest;
  onUpdateClick: (request: ExamRequest) => void;
};

const ExamRequestCard: React.FC<ExamRequestCardProps> = ({
  request,
  onUpdateClick,
}) => {
  const { title, date, status, details } = request;
  const { professor, type, notes, rooms } = details;

  const renderRooms = () => {
    if (!rooms || rooms.length === 0) {
      return null; // Don't display anything if rooms is null or empty
    }

    return (
      <p className="mb-1">
        Rooms:{" "}
        {rooms.map((room) => `${room.name} (${room.location})`).join(", ")}
      </p>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-gray-600">
            Professor: {professor.firstName} {professor.lastName}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-sm ${getStatusStyles(status)}`}
        >
          {status}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <p className="mb-1">Date: {formatDateTime(date)}</p>
        {type && <p className="mb-1">Type: {type}</p>}
        {notes && <p className="mb-1">Details: {notes}</p>}
        {renderRooms()}
      </div>
      {status === "Rejected" && (
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => onUpdateClick(request)}
            className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition text-sm"
          >
            Update Request
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamRequestCard;
