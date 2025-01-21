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
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);
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
            setToast({
              message: "User ID not found in cookies.",
              type: "error",
            });
            return;
          }

          const response = await api.get("/GetCoursersForExamByUserID", {
            params: { userId: userIdCookie },
          });

          setCourses(response.data);
        } catch (fetchError) {
          setToast({
            message: "Failed to fetch courses. Please try again.",
            type: "error",
          });
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
    if (!selectedCourseId) {
      setToast({
        message: "Please select a course.",
        type: "info",
      });
      return;
    }

    try {
      const groupId = Cookies.get("groupId");
      const formattedDate = date.toISOString(); // Ensure the date is in ISO format

      const examRequest = {
        courseId: selectedCourseId,
        groupId: groupId,
        examDate: formattedDate,
        details: notes.trim(),
      };

      // If updating, use PUT method, else use POST
      if (isUpdate && examId) {
        await api.put(`/event/exam-request/${examId}/pending`, examRequest);
      } else {
        await api.post("/event/exam-request", examRequest);
      }

      setNotes(""); // Clear the notes field
      clearToast(); // Reset toast notifications
      onClose(); // Close the modal
      window.location.reload(); // Refresh the page to reflect changes
    } catch (submitError) {
      setToast({
        message: "Failed to submit exam request. Please try again.",
        type: "error",
      });
    }
  };

  // Close the modal without making changes
  const handleClose = () => {
    onClose();
  };

  // Clear toast
  const clearToast = () => setToast(null);

  return (
    <>
      {/* ToastMessage notification */}
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
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
                          {course.title} {course.numeProfesor} {" "}
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
                    maxLength={120}
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
