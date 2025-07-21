import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Index from './pages/admin/Index'
import Login from './pages/admin/Login';
import Unauthorized from './pages/admin/Unauthorized';
import ProtectedRoute from './pages/admin/components/ProtectedRoute';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/unauthorized" element={<Unauthorized />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin" element={<Index />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;
