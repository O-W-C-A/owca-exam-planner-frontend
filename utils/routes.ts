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

export const hasAccess = (role: string, path: string): boolean => {
  if (!role) {
    console.log(`Access denied: No role provided for path "${path}".`);
    return false;
  }

  const normalizedRole = role.toLowerCase() as UserRole;
  const normalizedPath = path.toLowerCase();

  console.log(`Checking access for role "${normalizedRole}" to path "${normalizedPath}"...`);

  // Explicit access rules with subpath support
  if (normalizedRole === 'studentleader') {
    const hasAccess = normalizedPath.startsWith('/dashboard/studentleader');
    console.log(`Role "studentleader": ${hasAccess ? 'Access granted' : 'Access denied'} to path "${normalizedPath}".`);
    return hasAccess;
  }

  if (normalizedRole === 'student') {
    // Ensure `studentleader` is excluded
    const hasAccess = normalizedPath.startsWith('/dashboard/student') &&
      !normalizedPath.startsWith('/dashboard/studentleader');
    console.log(`Role "student": ${hasAccess ? 'Access granted' : 'Access denied'} to path "${normalizedPath}".`);
    return hasAccess;
  }

  // General rule for other roles
  const hasAccess = normalizedPath.startsWith(`/dashboard/${normalizedRole}`);
  console.log(`Role "${normalizedRole}": ${hasAccess ? 'Access granted' : 'Access denied'} to path "${normalizedPath}".`);
  return hasAccess;
};



export { ROUTES }; 