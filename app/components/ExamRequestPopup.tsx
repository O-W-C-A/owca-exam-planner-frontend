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
  examId?: string; // Removed isUpdate flag
  courseName?: string;
}>;

export function ExamRequestPopup({
  isOpen,
  onClose,
  selectedDate,
  initialNotes = "",
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
  const [selectedCourseId, setSelectedCourseId] = useState<string>(examId ?? "");

  // Update date when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      const localDate = new Date(selectedDate);
      // localDate.setHours(0, 0, 0, 0); // Set time to midnight for consistency
      setDate(localDate);
    }
  }, [selectedDate]);

  // Fetch courses if no examId (for new request)
  useEffect(() => {
    if (!examId) {
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
          console.log(fetchError);
          setToast({
            message: "Failed to fetch courses. Please try again.",
            type: "error",
          });
        }
      };
      fetchCourses();
    }
  }, [examId]);

  // Handle creating a new exam request
  const handleCreateExamRequest = async () => {
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

      await api.post("/event/exam-request", examRequest);

      setNotes(""); // Clear the notes field
      clearToast(); // Reset toast notifications
      onClose(); // Close the modal
      window.location.reload(); // Refresh the page to reflect changes
    } catch (submitError) {
      console.log(submitError);
      setToast({
        message: "Failed to submit exam request. Please try again.",
        type: "error",
      });
    }
  };

  // Handle updating an existing exam request
  const handleUpdateExamRequest = async () => {
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

      if (examId) {
        await api.put(`/event/exam-request/${examId}/pending`, examRequest);
      }

      setNotes(""); // Clear the notes field
      clearToast(); // Reset toast notifications
      onClose(); // Close the modal
      window.location.reload(); // Refresh the page to reflect changes
    } catch (submitError) {
      console.log(submitError);
      setToast({
        message: "Failed to update exam request. Please try again.",
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
                {examId ? "Update Exam Request" : "Request Exam Date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Course selection for new requests */}
                {!examId && (
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
                {examId && (
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
                    onChange={(e) =>
                      setDate(
                        new Date(
                          new Date(e.target.value).setDate(
                            new Date(e.target.value).getDate()
                          )
                        )
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    min={new Date(
                      new Date().setDate(new Date().getDate() + 1)
                    ).toLocaleDateString("en-CA")}
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
                    onClick={examId ? handleUpdateExamRequest : handleCreateExamRequest}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {examId ? "Update" : "Submit"}
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
