'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

type ExamRequestProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (data: {
    date: Date;
    notes: string;
  }) => void;
  initialNotes?: string;
  isUpdate?: boolean;
  courseName?: string; // Add courseName for display only
};

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

  const getDateValue = (date: Date) => {
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    onSubmit({
      date,
      notes: notes.trim(),
    });

    setNotes('');
    setError(null);
    onClose();
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <input
                  type="text"
                  value={courseName}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  disabled
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
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
                {isUpdate ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 