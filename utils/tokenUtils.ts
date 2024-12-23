import Cookies from 'js-cookie';

export const clearAuthData = () => {
  Cookies.remove('authToken');
  Cookies.remove('role');
  Cookies.remove('userId');
  Cookies.remove('groupId');
  Cookies.remove('groupName');
  Cookies.remove('departmentId');
}; 