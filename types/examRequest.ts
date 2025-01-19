// Represents a single exam request
export type ExamRequest = {
  id: string; // Unique identifier for the exam request
  groupId?: string; // Optional group ID associated with the exam request
  title: string; // Title or name of the exam request
  date: string; // The date of the exam request (ISO string)
  start: string | null; // The start time of the exam request, null if not set
  end: string | null; // The end time of the exam request, null if not set
  status: 'Pending' | 'Approved' | 'Rejected'; // Status of the exam request
  details: {
    professor: {
      firstName: string; // Professor's first name
      lastName: string; // Professor's last name
    };
    assistant: {
      firstName: string; // Assistant's first name (if available)
      lastName: string; // Assistant's last name (if available)
    } | null;
    group: string; // Group associated with the exam request (e.g., student group)
    type: string | null; // Type of exam (e.g., written, oral, etc.), null if not set
    notes: string | null; // Additional notes related to the exam request, null if not provided
    rooms: Room[]; // List of rooms associated with the exam request
  };
  courseId: string; // ID of the course the exam request is related to
};

// Represents the form data used for creating or updating an exam request
export type ExamRequestFormData = {
  date: Date; // The date of the exam
  notes: string; // Notes or comments related to the exam
  courseId?: string; // Optional course ID for the exam (if available)
};

// Represents the form data used for approving or modifying an exam request
export type ApproveFormData = {
  timeStart: string; // Start time for the approved exam request
  timeEnd: string; // End time for the approved exam request
  assistantId?: string; // Optional assistant ID for assigning an assistant to the exam
  type: string; // Type of exam (e.g., written, oral, etc.)
  notes?: string; // Optional notes or comments for the approval process
};

// Represents a room associated with an exam request
export type Room = {
  name: string; // Name of the room (e.g., "Room 101")
  location: string; // Location of the room (e.g., "Building A, Floor 2")
};
