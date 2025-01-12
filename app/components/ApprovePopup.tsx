import { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '@/utils/axiosInstance';

type Assistant = {
  id: string;
  firstName: string;
  lastName: string;
};

type Room = {
  roomID: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
  departmentName?: string;
};

type ApprovePopupProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onApprove: (data: {
    timeStart: string;
    timeEnd: string;
    assistantId?: string;
    type: string;
    notes?: string;
    roomsId: number[];
  }) => void;
}>;

export function ApprovePopup({ isOpen, onClose, courseId, onApprove }: ApprovePopupProps) {
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<{ value: string; label: string } | null>(null);
  const [examType, setExamType] = useState<string>('Written');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<{ value: number; label: string }[]>([]);

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

    const fetchRooms = async () => {
      try {
        const response = await api.get('/GetAllRooms');
        if (response.status === 200) {
          setRooms(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };

    if (isOpen) {
      fetchAssistants();
      fetchRooms();
    }
  }, [isOpen, courseId]);

  const assistantOptions = assistants.map(assistant => ({
    value: assistant.id,
    label: `${assistant.firstName} ${assistant.lastName}`
  }));

  const roomOptions = rooms.map(room => ({
    value: room.roomID,
    label: `${room.name} (${room.location})`
  }));

  const examTypes = [
    { value: 'Written', label: 'Written' },
    { value: 'Oral', label: 'Oral' },
    { value: 'Project', label: 'Project' },
    { value: 'Practice', label: 'Practice' }
  ];

  const isFormValid = timeStart && 
                     timeEnd && 
                     examType && 
                     selectedAssistant && 
                     selectedRooms.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Approve Exam Request</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="timeStart" className="block text-sm font-medium mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                id="timeStart"
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
                step="900" // 15-minute intervals
              />
            </div>
            <div>
              <label htmlFor="timeEnd" className="block text-sm font-medium mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                id="timeEnd"
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
            <label htmlFor="assistant" className="block text-sm font-medium mb-1">
              Assistant <span className="text-red-500">*</span>
            </label>
            <Select
              id="assistant"
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
            <label htmlFor="examType" className="block text-sm font-medium mb-1">
              Exam Type <span className="text-red-500">*</span>
            </label>
            <Select
              id="examType"
              value={examTypes.find(type => type.value === examType)}
              onChange={(option) => setExamType(option?.value || 'Written')}
              options={examTypes}
              className="w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="rooms" className="block text-sm font-medium mb-1">
              Rooms <span className="text-red-500">*</span>
            </label>
            <Select
              id="rooms"
              isMulti
              value={selectedRooms}
              onChange={(newValue) => setSelectedRooms(newValue as { value: number; label: string }[])}
              options={roomOptions}
              placeholder="Select rooms..."
              className="w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea
              id="notes"
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
                notes: notes.trim() || undefined,
                roomsId: selectedRooms.map(room => room.value),
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
