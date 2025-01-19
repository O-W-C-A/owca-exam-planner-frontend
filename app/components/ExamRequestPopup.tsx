"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import api from "@/utils/axiosInstance";
import Cookies from "js-cookie";

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
  // State initialization
  const [date, setDate] = useState<Date>(() =>
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
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

          if (!userIdCookie) {
            setError("User ID not found in cookies.");
            return;
          }

          const response = await api.get("/GetCoursersForExamByUserID", {
            params: { userId: userIdCookie },
          });

          setCourses(response.data);
        } catch (fetchError) {
          setError("No courses found.");
        }
      };
      fetchCourses();
    } else if (examId && courseName) {
      setSelectedCourseId(examId); // Pre-select the course when updating
    }
  }, [isUpdate, examId, courseName]);

  // Handle submitting the exam request (either for a new request or an update)
  const handleExamRequest = async () => {
    if (!selectedCourseId) {
      setError("Please select a course.");
      return;
    }

    try {
      const groupId = Cookies.get("groupId");
      const formattedDate = date.toISOString(); // Ensure the date is in ISO format
      console.log("formattedDate for backend:", formattedDate); // Log for debugging

      const examRequest = {
        courseId: selectedCourseId,
        groupId: groupId,
        examDate: formattedDate, // Send the date in ISO format
        details: notes.trim(),
      };

      console.log("examRequest", examRequest);

      if (isUpdate && examId) {
        // If updating, use PUT method
        await api.put(`/event/exam-request/${examId}/pending`, examRequest);
      } else {
        // If creating a new request, use POST method
        await api.post("/event/exam-request", examRequest);
      }

      // Clear inputs and close the modal after successful request
      setNotes("");
      setError(null);
      onClose();
      window.location.reload();
    } catch (submitError) {
      setError("Failed to submit exam request.");
    }
  };

  // Close the modal without making changes
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null; // Render nothing if the modal is not open

  return (
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
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                placeholder="Add any additional details..."
              />
            </div>

            {/* Display any error */}
            {error && <div className="text-red-500 text-sm">{error}</div>}

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
  );
}
