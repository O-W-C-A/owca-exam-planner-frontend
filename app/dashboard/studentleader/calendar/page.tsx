"use client";
import React, { useState } from "react";
import { useExamRequests } from "@/app/hooks/useExamRequests";
import { ExamRequest } from "@/types/examRequest";
import { ExamRequestPopup } from "@/app/components/ExamRequestPopup";
import ExamRequestDetailsModal from "@/app/components/ExamRequestDetailsModal";
import CalendarView from "@/app/components/CalendarView";
import ToastError from "@/app/components/ToastError";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { View } from "react-big-calendar";

const StudentLeaderCalendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExamRequest | null>(null);
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const { examRequests, error, refetch } = useExamRequests();

  // Track the current view
  const [view, setView] = useState<View>("month");

  // Track the current date
  const [date, setDate] = useState<Date>(new Date());

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setShowSuggestionPopup(true);
  };

  const handleSelectEvent = (event: ExamRequest) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Conditionally render the ToastError if there's an error */}
      {error && <ToastError message={error} type="error" />}

      <div className="flex-1 min-h-0">
        <CalendarView
          events={examRequests}
          view={view} // Pass the current view
          setView={setView} // Pass the setView function to update the view
          date={date} // Pass the current date
          setDate={setDate} // Pass the setDate function to update the date
          onEventSelect={handleSelectEvent}
          onSlotSelect={handleSelectSlot}
        />
      </div>

      {isModalOpen && selectedEvent && (
        <ExamRequestDetailsModal
          examRequest={selectedEvent}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {showSuggestionPopup && (
        <ExamRequestPopup
          isOpen={showSuggestionPopup}
          selectedDate={date} // Use the current date as the selected date
          onSubmit={(data) => {
            // handle submit logic here
          }}
          onClose={() => setShowSuggestionPopup(false)}
        />
      )}
    </div>
  );
};

export default StudentLeaderCalendar;
