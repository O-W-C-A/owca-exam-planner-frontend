type UserRole = 'admin' | 'professor' | 'student' | 'secretary' | 'studentleader';

const ROUTES = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    PROFESSOR: '/dashboard/professor',
    STUDENT: '/dashboard/student',
    SECRETARY: '/dashboard/secretary',
    STUDENTLEADER: '/dashboard/studentleader',
  }
} as const;

// Get dashboard route based on role
export const getDashboardRoute = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: ROUTES.DASHBOARD.ADMIN,
    professor: ROUTES.DASHBOARD.PROFESSOR,
    student: ROUTES.DASHBOARD.STUDENT,
    secretary: ROUTES.DASHBOARD.SECRETARY,
    studentleader: ROUTES.DASHBOARD.STUDENTLEADER,
  };

  return roleMap[role.toLowerCase() as UserRole] || ROUTES.LOGIN;
};

// Check if user has access to current path
export const hasAccess = (role: string, path: string): boolean => {
  if (!role) return false;

  const normalizedRole = role.toLowerCase() as UserRole;
  const normalizedPath = path.toLowerCase();

  // Special case for studentleader who can access student paths
  if (normalizedRole === 'studentleader') {
    return normalizedPath.startsWith('/dashboard/studentleader') || 
           normalizedPath.startsWith('/dashboard/student');
  }

  return normalizedPath.startsWith(`/dashboard/${normalizedRole}`);
};

export { ROUTES }; 