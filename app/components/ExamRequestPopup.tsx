"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import api from "@/utils/axiosInstance";
import Cookies from "js-cookie";
import ToastMessage from "@/app/components/ToastMessage";

// Define props for the ExamRequestPopup component
type ExamRequestProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSubmit?: (data: { date: Date; notes: string; courseId: string }) => void;
  initialNotes?: string;
  isUpdate?: boolean;
  courseName?: string;
  examId?: string;
}>;

// The main functional component for the exam request popup
export function ExamRequestPopup({
  isOpen,
  onClose,
  selectedDate,
  initialNotes = "",
  isUpdate = false,
  courseName,
  examId,
}: ExamRequestProps) {
  const [date, setDate] = useState<Date>(() =>
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [notes, setNotes] = useState(initialNotes);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state for Toast
  const [courses, setCourses] = useState<
    {
      id: string;
      title: string;
      numeProfesor: string;
      prenumeProfesor: string;
    }[]
  >([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  // Update date when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      const localDate = new Date(selectedDate);
      localDate.setHours(0, 0, 0, 0); // Set time to midnight for consistency
      setDate(localDate);
    }
  }, [selectedDate]);

  // Fetch courses when not in update mode
  useEffect(() => {
    if (!isUpdate) {
      const fetchCourses = async () => {
        try {
          const userIdCookie = Cookies.get("userId");

          // Ensure userId is available in cookies
          if (!userIdCookie) {
            setErrorMessage("User ID not found in cookies."); // Show error via ToastMessage
            return;
          }

          const response = await api.get("/GetCoursersForExamByUserID", {
            params: { userId: userIdCookie },
          });

          setCourses(response.data);
        } catch (fetchError) {
          setErrorMessage("No courses found."); // Show error via ToastMessage
        }
      };
      fetchCourses();
    } else if (examId && courseName) {
      // Pre-select the course when updating
      setSelectedCourseId(examId);
    }
  }, [isUpdate, examId, courseName]);

  // Handle submitting the exam request (either for a new request or an update)
  const handleExamRequest = async () => {
    // Ensure a course is selected
    if (!selectedCourseId) {
      setErrorMessage("Please select a course."); // Show error via ToastMessage
      return;
    }

    try {
      const groupId = Cookies.get("groupId");
      const formattedDate = date.toISOString(); // Ensure the date is in ISO format

      const examRequest = {
        courseId: selectedCourseId,
        groupId: groupId,
        examDate: formattedDate, // Send the date in ISO format
        details: notes.trim(),
      };

      // If updating, use PUT method, else use POST
      if (isUpdate && examId) {
        await api.put(`/event/exam-request/${examId}/pending`, examRequest);
      } else {
        await api.post("/event/exam-request", examRequest);
      }

      // Clear inputs and close the modal after successful request
      setNotes("");
      setErrorMessage(null); // Reset error message
      onClose();
      window.location.reload();
    } catch (submitError) {
      setErrorMessage("Failed to submit exam request."); // Show error via ToastMessage
    }
  };

  // Close the modal without making changes
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {/* Show error via ToastMessage if errorMessage is set */}
      {errorMessage && (
        <ToastMessage
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {isUpdate ? "Update Exam Request" : "Request Exam Date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Course selection for new requests */}
                {!isUpdate && (
                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Course
                    </label>
                    <select
                      id="course"
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    >
                      <option value="" disabled>
                        Select a course
                      </option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title} {course.numeProfesor}{" "}
                          {course.prenumeProfesor}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* If it's an update, show the course name as readonly */}
                {isUpdate && (
                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Course
                    </label>
                    <input
                      id="course"
                      value={courseName}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                )}

                {/* Date picker */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date.toLocaleDateString("en-CA")}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                    min={new Date().toLocaleDateString("en-CA")}
                    disabled
                  />
                </div>

                {/* Notes input */}
                <div>
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Details
                  </label>
                  <textarea
                    id="details"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md min-h-[100px] max-h-[150px]"
                    placeholder="Add any additional details..."
                    maxLength={120} // Limit to 120 characters
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {notes.length} / 120 characters
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExamRequest}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {isUpdate ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
