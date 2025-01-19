"use client";
import React, { useState } from "react";
import { useExamRequests } from "@/app/hooks/useExamRequests"; // Custom hook to fetch exam requests
import { ExamRequest } from "@/types/examRequest"; // Exam request type definition
import ExamRequestDetailsModal from "@/app/components/ExamRequestDetailsModal"; // Modal for exam request details
import CalendarView from "@/app/components/CalendarView"; // Calendar component
import ToastError from "@/app/components/ToastError"; // Error toast component
import "react-big-calendar/lib/css/react-big-calendar.css"; // Calendar styles
import Cookies from "js-cookie"; // For retrieving user role
import { View } from "react-big-calendar"; // Calendar view type
import { UserType } from "@/types/userType"; // User type enum

const StudentCalendar: React.FC = () => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedEvent, setSelectedEvent] = useState<ExamRequest | null>(null); // Selected event for modal
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Selected date for new requests
  const { examRequests, error } = useExamRequests(); // Fetch exam requests using a custom hook
  const [view, setView] = useState<View>("month"); // Calendar view state (month, week, day)
  const [date, setDate] = useState<Date>(new Date()); // Current calendar date
  const userRole = Cookies.get("role"); // Retrieve user role from cookies

  /**
   * Handles selection of an event in the calendar.
   * Opens the modal and displays event details.
   */
  const handleSelectEvent = (event: ExamRequest) => {
    setSelectedEvent(event); // Set the selected event
    setIsModalOpen(true); // Open the modal
  };

  /**
   * Closes the exam request details modal.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  /**
   * Handles slot selection for creating new exam requests.
   * Validates that the selected date is in the future and not already booked.
   */
  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to midnight for comparison

    const selectedDate = new Date(slotInfo.start);
    selectedDate.setHours(0, 0, 0, 0); // Reset selected date to midnight

    if (selectedDate.getTime() <= now.getTime()) {
      alert("Cannot select slots for today or past dates.");
      return; // Exit if the date is invalid
    }

    const isDateTaken = examRequests.some((event) => {
      const eventDate = new Date(event.date); // Assuming `event.date` contains the event date
      eventDate.setHours(0, 0, 0, 0); // Reset event date to midnight
      return eventDate.getTime() === selectedDate.getTime();
    });

    if (isDateTaken) {
      alert("This date is already taken. Please select another date.");
      return; // Exit if the date is already booked
    }

    setSelectedDate(selectedDate); // Update the selected date for creating a new request
  };

  // No-op function to disable slot selection for students
  const noop = () => {};

  return (
    <div className="h-full flex flex-col">
      {/* Error Toast */}
      {error && <ToastError message={error} type="error" />}

      <div className="flex-1 min-h-0">
        {/* Calendar View */}
        <CalendarView
          events={examRequests} // Pass fetched events
          view={view} // Current calendar view
          setView={setView} // Function to update view
          date={date} // Current calendar date
          setDate={setDate} // Function to update date
          onEventSelect={handleSelectEvent} // Handle event selection
          onSlotSelect={userRole !== UserType.Student ? handleSlotSelect : noop} // Disable slot selection for students
        />
      </div>

      {/* Modal for Exam Request Details */}
      {isModalOpen && selectedEvent && (
        <ExamRequestDetailsModal
          examRequest={selectedEvent} // Pass selected event
          onClose={handleCloseModal} // Function to close the modal
          onApprove={() => {}} // Placeholder for approval logic
          onReject={() => {}} // Placeholder for rejection logic
          isProfessor={userRole === UserType.Professor} // Enable professor-specific actions
        />
      )}
    </div>
  );
};

export default StudentCalendar;
