export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  // Student/StudentLeader fields
  faculty?: string;
  group?: string;
  // Professor fields
  department?: string;
} | null; 