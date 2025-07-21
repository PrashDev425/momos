import { Navigate, Outlet } from 'react-router-dom';

const getRoleFromCookie = () => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('role='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

const ProtectedRoute = ({ allowedRoles }) => {
  const role = getRoleFromCookie();

  if (!role) return <Navigate to="admin/login" replace />;

  try {
    console.log(role);
    if (allowedRoles.includes(role)) {
      return <Outlet />;
    } else {
      return <Navigate to="/admin/unauthorized" replace />;
    }
  } catch (err) {
    console.error('Token decoding error:', err);
    return <Navigate to="admin/login" replace />;
  }
};

export default ProtectedRoute;
