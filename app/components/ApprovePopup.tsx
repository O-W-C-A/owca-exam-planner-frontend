'use client';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '@/utils/axiosInstance';

type Assistant = {
  id: string;
  firstName: string;
  lastName: string;
};

type ApprovePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onApprove: (data: {
    timeStart: string;
    timeEnd: string;
    assistantId?: string;
    type: string;
    notes?: string;
  }) => void;
};

export function ApprovePopup({ isOpen, onClose, courseId, onApprove }: ApprovePopupProps) {
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<{ value: string; label: string } | null>(null);
  const [examType, setExamType] = useState<string>('Written');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/users/assistants/${courseId}`);
        if (response.status === 200) {
          setAssistants(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch assistants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && courseId) {
      fetchAssistants();
    }
  }, [isOpen, courseId]);

  const assistantOptions = assistants.map(assistant => ({
    value: assistant.id,
    label: `${assistant.firstName} ${assistant.lastName}`
  }));

  const examTypes = [
    { value: 'Written', label: 'Written' },
    { value: 'Oral', label: 'Oral' },
    { value: 'Project', label: 'Project' },
    { value: 'Practice', label: 'Practice' }
  ];

  const isFormValid = timeStart && 
                     timeEnd && 
                     selectedAssistant && 
                     examType;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Approve Exam Request</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                step="900" // 15-minute intervals
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                step="900" // 15-minute intervals
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Assistant <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedAssistant}
              onChange={setSelectedAssistant}
              options={assistantOptions}
              isLoading={isLoading}
              isClearable={false}
              placeholder="Select assistant..."
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Exam Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={examTypes.find(type => type.value === examType)}
              onChange={(option) => setExamType(option?.value || 'Written')}
              options={examTypes}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter additional details..."
              className="w-full p-3 border rounded-md h-24"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApprove({
                timeStart,
                timeEnd,
                assistantId: selectedAssistant?.value,
                type: examType,
                notes: notes.trim() || undefined
              });
              onClose();
            }}
            disabled={!isFormValid}
            className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
} 