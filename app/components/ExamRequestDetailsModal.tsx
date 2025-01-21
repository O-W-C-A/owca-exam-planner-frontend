import React from "react";
import { ExamRequest } from "@/types/examRequest"; // Import the ExamRequest type for type safety
import { getExamRequestStatusStyles } from "@/utils/examRequestUtils"; // Utility function to get status-based styles

// Define the interface for the modal props, specifying required props for the modal
interface ExamRequestDetailsModalProps {
  examRequest: ExamRequest; // Exam request details to be displayed in the modal
  onClose: () => void; // Function to close the modal
  onApprove: () => void; // Function to approve the exam request
  onReject: () => void; // Function to reject the exam request
  isProfessor: boolean; // Flag to check if the current user is a professor (for displaying action buttons)
}

// Functional component for the ExamRequestDetailsModal
const ExamRequestDetailsModal: React.FC<ExamRequestDetailsModalProps> = ({
  examRequest,
  onClose,
  onApprove,
  onReject,
  isProfessor,
}) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
    {/* Modal container with background overlay */}
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
      {/* Modal header with exam request title and status */}
      <h2 className="text-xl font-bold mb-4">
        {examRequest.title} {/* Display exam request title */}
        <span
          className={`ml-2 px-2 py-1 text-sm rounded ${getExamRequestStatusStyles(
            examRequest.status // Get styles based on the status (approved, rejected, etc.)
          )}`}
        >
          {examRequest.status} {/* Display the status of the exam request */}
        </span>
      </h2>

      <div>
        {/* Render the details of the exam request */}
        <p className="mb-2">
          <strong className="font-semibold">Professor:</strong>{" "}
          {`${examRequest.details.professor.firstName} ${examRequest.details.professor.lastName}`}
          {/* Display the professor's full name */}
        </p>

        {/* Conditionally render the assistant details if available */}
        {examRequest.details.assistant && (
          <p className="mb-2">
            <strong className="font-semibold">Assistant:</strong>{" "}
            {`${examRequest.details.assistant.firstName} ${examRequest.details.assistant.lastName}`}
            {/* Display the assistant's full name */}
          </p>
        )}

        {/* Conditionally render the exam type if available */}
        {examRequest.details.type && (
          <p className="mb-2">
            <strong className="font-semibold">Type:</strong>{" "}
            {examRequest.details.type}
            {/* Display the exam type (e.g., written, oral) */}
          </p>
        )}

        {/* Display the exam request date */}
        <p className="mb-2">
          <strong className="font-semibold">Date:</strong>{" "}
          {new Date(examRequest.date).toLocaleDateString()}
          {/* Format and display the exam date */}
        </p>

        {/* Conditionally render exam start and end times only if the exam status is Approved */}
        {examRequest.status === "Approved" &&
          examRequest.start &&
          examRequest.end && (
            <p className="mb-2">
              <strong className="font-semibold">Time:</strong>{" "}
              {`${new Date(
                examRequest.start
              ).toLocaleTimeString()} - ${new Date(
                examRequest.end
              ).toLocaleTimeString()}`}
              {/* Display the start and end times of the exam */}
            </p>
          )}

        {/* Conditionally render room details if available */}
        {examRequest.details?.rooms && examRequest.details.rooms.length > 0 && (
          <p className="mb-2">
            <strong className="font-semibold">Rooms:</strong>{" "}
            {examRequest.details.rooms
              .map((room) => `${room.name} (${room.location})`)
              .join(", ")}
            {/* Display the rooms and their locations */}
          </p>
        )}

        {/* Conditionally render additional notes if available */}
        {examRequest.details.notes && (
          <p className="mb-2">
            <strong className="font-semibold">Details:</strong>{" "}
            {examRequest.details.notes}
            {/* Display any additional notes for the exam */}
          </p>
        )}
      </div>

      {/* Buttons section for approving, rejecting, or closing the modal */}
      <div className="flex justify-end space-x-4 mt-6">
        {/* Display approve and reject buttons if the user is a professor and the request is not already approved or rejected */}
        {isProfessor &&
          examRequest.status !== "Approved" &&
          examRequest.status !== "Rejected" && (
            <>
              <button
                onClick={onApprove} // Trigger the approve action
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Approve
              </button>

              <button
                onClick={onReject} // Trigger the reject action
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
            </>
          )}

        {/* Close button to close the modal */}
        <button
          onClick={onClose} // Trigger the close action
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ExamRequestDetailsModal;
