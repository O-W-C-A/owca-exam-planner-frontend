export type ExamRequest = {
  id: string;
  title: string;
  date: string;
  start: string | null;
  end: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  details: {
    professor: {
      firstName: string;
      lastName: string;
    };
    assistant: {
      firstName: string;
      lastName: string;
    } | null;
    group: string;
    type: string | null;
    notes: string | null;
    rooms:Room[],
  };
  courseId: string;
};

export type ExamRequestFormData = {
  date: Date;
  notes: string;
  courseId?: string;
};

export type ApproveFormData = {
  timeStart: string;
  timeEnd: string;
  assistantId?: string;
  type: string;
  notes?: string;
}; 

export type Room = {
  name: string;
  location: string;
};