'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import api from '@/utils/axiosInstance';

type ExamRequestProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (data: {
    date: Date;
    notes: string;
    courseId: string;
  }) => void;
  initialNotes?: string;
  isUpdate?: boolean;
  courseName?: string;
}>;

export function ExamRequestPopup({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onSubmit,
  initialNotes = '',
  isUpdate = false,
  courseName = ''
}: ExamRequestProps) {
  const [date, setDate] = useState(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date() : d;
  });
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<{ id: string; title: string ;numeProfesor: string;prenumeProfesor:string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const userIdCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('userId='))
          ?.split('=')[1];

        if (!userIdCookie) {
          setError('User ID not found in cookies.');
          return;
        }

        const response = await api.get(`/GetCoursersForExamByUserID`, {
          params: { userId: userIdCookie },
        });

        setCourses(response.data);
      } catch {
        setError('Nu sunt cursuri.');
      }
    };

    fetchCourses();
  }, []);


  const getDateValue = (date: Date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + 1); // Adaugă o zi
    return isNaN(adjustedDate.getTime()) ? '' : adjustedDate.toISOString().split('T')[0];
  };
  

  const handleSubmit = () => {
    if (!selectedCourseId && !isUpdate) {
      setError('Please select a course.');
      return;
    }
  
    // Transmitem `selectedCourseId` garantat ca string
    onSubmit({
      date,
      notes: notes.trim(),
      courseId: selectedCourseId as string,
    });
  
    setNotes('');
    setError(null);
    onClose();
    window.location.reload();
  };
  const handleClose = () => {
    onClose();
    window.location.reload();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isUpdate ? 'Update Exam Request' : 'Request Exam Date'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isUpdate && (
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <input
                  id="course"
                  type="text"
                  value={courseName}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  disabled
                />
              </div>
            )}
           {!isUpdate && (
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
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
                      {course.title} {(course.numeProfesor+' '+course.prenumeProfesor)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={getDateValue(date)}
                onChange={(e) => {
                  const newDate = e.target.value ? new Date(e.target.value) : new Date();
                  setDate(newDate);
                }}
                className="w-full px-3 py-2 border rounded-md [&::-webkit-calendar-picker-indicator]:bg-white [&::-webkit-calendar-picker-indicator]:dark:bg-white [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-clear-button]:hidden"
                min={new Date().toISOString().split('T')[0]}
                style={{
                  colorScheme: 'light'
                }}
              />
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
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

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isUpdate ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 