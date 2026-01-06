export type User = {
  name: string;
  year: string;
  branch: string;
  hostel: string;
  productivityScore: number;
  cgpa: number;
  avatarUrl: string;
};

export type TimetableEntry = {
  id: number;
  day: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'cancelled';
  type: 'lecture' | 'lab' | 'break' | 'task';
};

export type AcademicMetrics = {
  attendance: number;
  assignmentsMissed: number;
  stressLevel: number;
};

export type Task = {
  id: number;
  type: 'study' | 'coding' | 'wellness' | 'group-study' | 'refresh';
  suggestion: string;
  duration: string;
  completed: boolean;
};

export type Issue = {
    id: string;
    roomNumber: string;
    category: string;
    description: string;
    status: 'Pending' | 'Active' | 'Closed';
    raisedOn: Date;
    closedOn?: Date;
}

export type SubjectAttendance = {
    name: string;
    attended: number;
    total: number;
};
