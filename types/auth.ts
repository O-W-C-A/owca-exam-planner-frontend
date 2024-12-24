export type BaseAuthResponse = {
  token: string;
  role: string;
  userId: number;
};

export type StudentAuthResponse = BaseAuthResponse & {
  isLeader: boolean;
  groupId?: number;
  groupName?: string;
};

export type ProfessorAuthResponse = BaseAuthResponse & {
  departmentId?: number;
  // Add other professor-specific fields
};

// Add other role-specific types as needed 