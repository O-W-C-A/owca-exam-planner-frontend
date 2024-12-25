'use client';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import api from '@/utils/axiosInstance';
import Cookies from 'js-cookie';

type Course = {
  id: string;
  name: string;
  professorId: string;
};

type ExamRequestProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (data: {
    courseId: string;
    date: Date;
    notes: string;
  }) => void;
};

export function ExamRequestPopup({ isOpen, onClose, selectedDate, onSubmit }: ExamRequestProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const groupId = Cookies.get('groupId');
        const response = await api.get(`/course/group/${groupId}`);
        if (response.status === 200) {
          const courseOptions = response.data.map((course: Course) => ({
            value: course.id,
            label: course.name,
            professorId: course.professorId
          }));
          setCourses(courseOptions);
        }
      } catch (error: unknown) {
        console.log('Failed to load courses', error);
        setError(error instanceof Error ? error.message : 'Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    onSubmit({
      courseId: selectedCourse.id,
      date: selectedDate,
      notes: notes.trim(),
    });

    setSelectedCourse(null);
    setNotes('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Request Exam Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selected Date
              </label>
              <input
                type="text"
                value={selectedDate.toLocaleDateString()}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <Select
                value={selectedCourse}
                onChange={setSelectedCourse}
                options={courses}
                className="w-full"
                placeholder="Select a course..."
                isLoading={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
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
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 