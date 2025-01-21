"use client";
import React, { useState } from "react";
import { useExamRequests } from "@/app/hooks/useExamRequests";
import { ExamRequest } from "@/types/examRequest";
import { ExamRequestPopup } from "@/app/components/ExamRequestPopup";
import ExamRequestDetailsModal from "@/app/components/ExamRequestDetailsModal";
import CalendarView from "@/app/components/CalendarView";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Cookies from "js-cookie";
import { View } from "react-big-calendar";
import { UserType } from "@/types/userType";
import ToastMessage from "@/app/components/ToastMessage";

const StudentLeaderCalendar: React.FC = () => {
  // State for managing toast notifications
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  // State for managing modal visibility and selected event details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExamRequest | null>(null);

  // State for managing the suggestion popup and selected date
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch exam requests and handle errors
  const { examRequests } = useExamRequests();

  // State for managing the calendar view and current date
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState<Date>(new Date());

  // Retrieve the user role from cookies
  const userRole = Cookies.get("role");

  // Handle slot selection (when a user clicks on an empty time slot in the calendar)
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    setShowSuggestionPopup(true);
  };

  // Handle event selection (when a user clicks on an existing event in the calendar)
  const handleSelectEvent = (event: ExamRequest) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Close the details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Clear toast notifications
  const clearToast = () => setToast(null);

  return (
    <div className="h-full flex flex-col">
      {/* Display toast notifications if any */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      <div className="flex-1 min-h-0">
        {/* Render the calendar view with event and slot handlers */}
        <CalendarView
          events={examRequests}
          view={view}
          setView={setView}
          date={date}
          setDate={setDate}
          onEventSelect={handleSelectEvent}
          onSlotSelect={handleSelectSlot}
        />
      </div>

      {/* Render the details modal if an event is selected */}
      {isModalOpen && selectedEvent && (
        <ExamRequestDetailsModal
          examRequest={selectedEvent}
          onClose={handleCloseModal}
          onApprove={() => {
            setToast({ message: "Approved successfully!", type: "success" });
          }}
          onReject={() => {
            setToast({ message: "Rejected successfully!", type: "error" });
          }}
          isProfessor={userRole === UserType.Professor}
        />
      )}

      {/* Render the suggestion popup if a date is selected */}
      {showSuggestionPopup && selectedDate && (
        <ExamRequestPopup
          isOpen={showSuggestionPopup}
          selectedDate={selectedDate}
          onClose={() => setShowSuggestionPopup(false)}
        />
      )}
    </div>
  );
};

export default StudentLeaderCalendar;
