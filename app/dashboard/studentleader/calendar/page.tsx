"use client";
import React, { useState } from "react";
import { useExamRequests } from "@/app/hooks/useExamRequests";
import { ExamRequest } from "@/types/examRequest";
import { ExamRequestPopup } from "@/app/components/ExamRequestPopup";
import ExamRequestDetailsModal from "@/app/components/ExamRequestDetailsModal";
import CalendarView from "@/app/components/CalendarView";
import ToastMessageError from "@/app/components/ToastMessage";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Cookies from "js-cookie";
import { View } from "react-big-calendar";
import { UserType } from "@/types/userType";

const StudentLeaderCalendar: React.FC = () => {
  // State for managing modal visibility and selected event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExamRequest | null>(null);
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Track selected date for the exam request
  const { examRequests, error } = useExamRequests(); // Fetch exam requests
  const [view, setView] = useState<View>("month"); // Track calendar view (month, week, etc.)
  const [date, setDate] = useState<Date>(new Date()); // Track current date for the calendar view
  const userRole = Cookies.get("role"); // Retrieve the user role from cookies

  // Handle slot selection from the calendar view
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start); // Store the selected start date of the slot
    setShowSuggestionPopup(true); // Open the suggestion popup to create a new exam request
  };

  // Handle event selection (opens the details modal for an exam request)
  const handleSelectEvent = (event: ExamRequest) => {
    setSelectedEvent(event); // Set the selected event details
    setIsModalOpen(true); // Open the event details modal
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="h-full flex flex-col">
      {/* Display error message if an error occurs while fetching exam requests */}
      {error && <ToastMessageError message={error} type="error" />}

      <div className="flex-1 min-h-0">
        {/* Calendar view to display exam requests and handle slot/event selection */}
        <CalendarView
          events={examRequests} // Pass in fetched exam requests as events
          view={view} // Current calendar view (month, week, etc.)
          setView={setView} // Function to change the calendar view
          date={date} // Current date to display in the calendar
          setDate={setDate} // Function to set the current date
          onEventSelect={handleSelectEvent} // Event handler for selecting an event
          onSlotSelect={handleSelectSlot} // Event handler for selecting a slot
        />
      </div>

      {/* Modal for viewing details of the selected exam request */}
      {isModalOpen && selectedEvent && (
        <ExamRequestDetailsModal
          examRequest={selectedEvent} // Pass the selected event's details
          onClose={handleCloseModal} // Close the modal when triggered
          onApprove={() => {}} // Placeholder function for approving (can be implemented later)
          onReject={() => {}} // Placeholder function for rejecting (can be implemented later)
          isProfessor={userRole === UserType.Professor} // Determine if the user is a professor
        />
      )}

      {/* Popup for submitting an exam request, shown when a date is selected */}
      {showSuggestionPopup && selectedDate && (
        <ExamRequestPopup
          isOpen={showSuggestionPopup} // Control the visibility of the popup
          selectedDate={selectedDate} // Pass the selected date to the popup
          onClose={() => setShowSuggestionPopup(false)} // Close the popup when triggered
        />
      )}
    </div>
  );
};

export default StudentLeaderCalendar;
