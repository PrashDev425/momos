import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useUser();

    // Show nothing or a loader while user info is loading
    if (loading) return null;

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (allowedRoles.includes(user.role)) {
        return <Outlet />;
    } else {
        return <Navigate to="/admin/unauthorized" replace />;
    }
};

export default ProtectedRoute;
