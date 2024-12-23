'use client';
import { useState } from 'react';
import Select from 'react-select';
import { Card, CardContent, CardHeader, CardTitle } from './card';

type Professor = {
  value: string;
  label: string;
};

type ExamSuggestionProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (data: {
    professorId: string;
    date: Date;
    notes: string;
  }) => void;
};

export function ExamSuggestionPopup({ isOpen, onClose, selectedDate, onSubmit }: ExamSuggestionProps) {
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Mock professors data - replace with API call
  const professors: Professor[] = [
    { value: '1', label: 'Prof. Smith' },
    { value: '2', label: 'Prof. Johnson' },
    // Add more professors
  ];

  const handleSubmit = () => {
    if (!selectedProfessor) {
      setError('Please select a professor');
      return;
    }

    onSubmit({
      professorId: selectedProfessor.value,
      date: selectedDate,
      notes: notes.trim(),
    });

    // Reset form
    setSelectedProfessor(null);
    setNotes('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Suggest Exam Date</CardTitle>
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
                Professor
              </label>
              <Select
                value={selectedProfessor}
                onChange={setSelectedProfessor}
                options={professors}
                className="w-full"
                placeholder="Select a professor..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                placeholder="Add any additional notes..."
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