"use client";
import React, { useState } from "react";
import { useExamRequests } from "@/app/hooks/useExamRequests"; // Custom hook to fetch exam requests
import { ExamRequest } from "@/types/examRequest"; // Exam request type definition
import ExamRequestDetailsModal from "@/app/components/ExamRequestDetailsModal"; // Modal for exam request details
import CalendarView from "@/app/components/CalendarView"; // Calendar component
import "react-big-calendar/lib/css/react-big-calendar.css"; // Calendar styles
import Cookies from "js-cookie"; // For retrieving user role
import { View } from "react-big-calendar"; // Calendar view type
import { UserType } from "@/types/userType"; // User type enum
import ToastMessage from "@/app/components/ToastMessage"; // Component for displaying toast notifications

const StudentCalendar: React.FC = () => {
  // State to manage toast notifications
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to store the currently selected event for the modal
  const [selectedEvent, setSelectedEvent] = useState<ExamRequest | null>(null);

  // Fetch exam requests and any associated errors using the custom hook
  const { examRequests, error } = useExamRequests();

  // State to manage the current view of the calendar (month, week, day)
  const [view, setView] = useState<View>("month");

  // State to manage the current date displayed on the calendar
  const [date, setDate] = useState<Date>(new Date());

  // Retrieve the user's role from cookies
  const userRole = Cookies.get("role");

  /**
   * Handles the selection of an event in the calendar.
   * Opens the modal to display the details of the selected event.
   *
   * @param event - The selected exam request event
   */
  const handleSelectEvent = (event: ExamRequest) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  /**
   * Closes the modal displaying exam request details.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Placeholder function to disable slot selection for students.
   */
  const noop = () => {};

  /**
   * Clears the current toast notification.
   */
  const clearToast = () => setToast(null);

  // Display a toast message if there is an error fetching exam requests
  if (error) {
    setToast({ message: "Failed to load exam requests. Please try again.", type: "error" });
  }

  return (
    <div className="h-full flex flex-col">
      {/* Display toast notification if present */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      <div className="flex-1 min-h-0">
        {/* Render the calendar view */}
        <CalendarView
          events={examRequests} // Pass fetched events
          view={view} // Current calendar view
          setView={setView} // Function to update view
          date={date} // Current calendar date
          setDate={setDate} // Function to update date
          onEventSelect={handleSelectEvent} // Handle event selection
          onSlotSelect={noop} // Disable slot selection for students
        />
      </div>

      {/* Render the modal for exam request details if open */}
      {isModalOpen && selectedEvent && (
        <ExamRequestDetailsModal
          examRequest={selectedEvent} // Pass selected event
          onClose={handleCloseModal} // Function to close the modal
          onApprove={() => {
            setToast({ message: "Exam request approved.", type: "success" });
          }} // Display success toast on approval
          onReject={() => {
            setToast({ message: "Exam request rejected.", type: "error" });
          }} // Display error toast on rejection
          isProfessor={userRole === UserType.Professor} // Enable professor-specific actions
        />
      )}
    </div>
  );
};

export default StudentCalendar;
