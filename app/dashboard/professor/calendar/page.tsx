// Indicates client-side rendering for this component
"use client";

// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { RejectPopup } from "@/app/components/RejectPopup"; // Popup for rejecting an exam request
import { ApprovePopup } from "@/app/components/ApprovePopup"; // Popup for approving an exam request
import { useUser } from "@/contexts/UserContext"; // Context hook to access user details
import Cookies from "js-cookie"; // Utility for managing cookies
import api from "@/utils/axiosInstance"; // Axios instance for API calls
import CalendarView from "@/app/components/CalendarView"; // Calendar view component
import ExamRequestDetailsModal from "@/app/components/ExamRequestDetailsModal"; // Modal to view and manage exam request details
import { View } from "react-big-calendar"; // View type for the calendar
import { useExamRequests } from "@/app/hooks/useExamRequests"; // Custom hook to manage exam requests
import "react-big-calendar/lib/css/react-big-calendar.css"; // Calendar component styles
import Select from "react-select"; // Dropdown component for course selection
import { ExamType } from "@/types/examType"; // Type for exam details
import { ExamRequest } from "@/types/examRequest"; // Type for exam requests
import { UserType } from "@/types/userType"; // Enum for user roles
import ToastMessage from "@/app/components/ToastMessage";

const ProfessorCalendar: React.FC = () => {
  // Access the current user from context
  const { user } = useUser();

  // State variables for managing component data
  const [view, setView] = useState<View>("month"); // Calendar view type
  const [date, setDate] = useState<Date>(new Date()); // Selected date
  const [selectedEvent, setSelectedEvent] = useState<ExamRequest | null>(null); // Currently selected calendar event
  const [showRejectPopup, setShowRejectPopup] = useState(false); // Controls visibility of reject popup
  const [showApprovePopup, setShowApprovePopup] = useState(false); // Controls visibility of approve popup
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls visibility of exam request modal
  const userRole = Cookies.get("role"); // Get user role from cookies
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  // Destructure properties from custom hook
  const {
    courses,
    selectedCourse,
    setSelectedCourse,
    examRequests,
    isLoading,
    fetchCourses,
    fetchExamRequests,
  } = useExamRequests();

  // Initialize selected course to "All Courses" on component mount
  useEffect(() => {
    setSelectedCourse({ id: "all", name: "All Courses" });
  }, [setSelectedCourse]);

  // Fetch courses when user role is professor
  useEffect(() => {
    if (user?.role === UserType.Professor) {
      fetchCourses();
    }
  }, [user, fetchCourses]);

  // Fetch exam requests based on selected course
  useEffect(() => {
    if (selectedCourse) {
      fetchExamRequests(selectedCourse.id);
    } else {
      fetchExamRequests(null); // Fetch all requests if no course is selected
    }
  }, [selectedCourse, fetchExamRequests]);

  // Handle calendar event selection
  const handleSelectEvent = (event: ExamRequest) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Close modal for exam request details
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle approval of an exam request
  const handleApprove = () => {
    if (selectedEvent) {
      setShowApprovePopup(true);
    }
  };

  // Handle rejection of an exam request
  const handleReject = () => {
    if (selectedEvent) {
      setShowRejectPopup(true);
    }
  };

  // Confirm approval of an exam request
  const handleConfirm = async (data: {
    timeStart: string;
    timeEnd: string;
    assistantId?: string;
    type: ExamType;
    notes?: string;
    roomsId: number[];
  }) => {
    try {
      if (!selectedEvent) return;
      const response = await api.put(
        `/event/exam-request/${selectedEvent.id}/approve`,
        data
      );
      if (response.status === 200) {
        setToast({ message: "Exam request approved successfully", type: "success" });
        setShowApprovePopup(false);
        setIsModalOpen(false);
        fetchExamRequests(null);
      }
    } catch (error: unknown) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to approve exam request",
        type: "error",
      });
    }
  };

  // Confirm rejection of an exam request
  const handleRejectConfirm = async (reason: string) => {
    try {
      if (!selectedEvent) return;
      const response = await api.put(
        `/event/exam-request/${selectedEvent.id}/reject`,
        { reason }
      );
      if (response.status === 200) {
        setToast({ message: "Exam request rejected successfully", type: "success" });
        setShowRejectPopup(false);
        setIsModalOpen(false);
        fetchExamRequests(null);
      }
    } catch (error: unknown) {
      setToast({
        message: "Failed to reject exam request",
        type: "error",
      });
    }
  };

  // Clear toast
  const clearToast = () => setToast(null);

  return (
    <div className="h-full flex flex-col">
      {/* ToastMessage notification */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      {/* Course selection dropdown */}
      <div className="mb-4">
        <Select
          value={
            selectedCourse
              ? { label: selectedCourse.name, value: selectedCourse.id }
              : null
          }
          onChange={(selectedOption) => {
            const course = selectedOption
              ? { id: selectedOption.value, name: selectedOption.label }
              : null;
            setSelectedCourse(course);
          }}
          options={[
            { label: "All Courses", value: "all" },
            ...courses.map((course) => ({
              label: course.name,
              value: course.id,
            })),
          ]}
          className="w-64"
          placeholder="Select a Course"
          isLoading={isLoading}
          isClearable={false}
          classNames={{
            control: () => "h-8 min-h-[32px] bg-white",
            valueContainer: () => "h-8",
            input: () => "h-8 m-0 p-0",
            placeholder: () => "leading-8",
            singleValue: () => "leading-8",
            indicatorsContainer: () => "h-8",
            menu: () => "bg-white shadow-lg border",
            menuList: () => "bg-white",
            option: (state) =>
              state.isFocused
                ? "bg-gray-100 text-black"
                : "bg-white text-black",
          }}
          styles={{
            menu: (base) => ({
              ...base,
              backgroundColor: "white",
              zIndex: 50,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#f3f4f6" : "white",
              color: "black",
              opacity: 1,
            }),
          }}
        />
      </div>

      {/* Calendar view */}
      <div className="flex-1">
        <CalendarView
          events={examRequests}
          view={view}
          setView={setView}
          date={date}
          setDate={setDate}
          onEventSelect={handleSelectEvent}
          onSlotSelect={() => {}} // Disable slot selection for professors
        />
      </div>

      {/* Exam request details modal */}
      {isModalOpen && selectedEvent && (
        <ExamRequestDetailsModal
          examRequest={selectedEvent}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onReject={handleReject}
          isProfessor={userRole === UserType.Professor}
        />
      )}

      {/* Reject popup */}
      {showRejectPopup && (
        <RejectPopup
          isOpen={showRejectPopup}
          onClose={() => setShowRejectPopup(false)}
          onReject={handleRejectConfirm}
        />
      )}

      {/* Approve popup */}
      {showApprovePopup && (
        <ApprovePopup
          isOpen={showApprovePopup}
          onClose={() => setShowApprovePopup(false)}
          courseId={selectedEvent?.courseId || ""}
          onApprove={handleConfirm}
        />
      )}
    </div>
  );
};

export default ProfessorCalendar;
