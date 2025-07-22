import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Unauthorized from './pages/admin/Unauthorized';
import PageNotFound from './pages/PageNotFound'
import ProtectedRoute from './pages/admin/components/ProtectedRoute';
import MomoList from './pages/admin/momo/MomoList';
import MomoForm from './pages/admin/momo/MomoForm';
import MomoDetail from './pages/admin/momo/MomoDetail';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/unauthorized" element={<Unauthorized />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin/" element={<MomoList />} />
                <Route path="/admin/momo" element={<MomoList />} />
                <Route path="/admin/momo/create" element={<MomoForm />} />
                <Route path="/admin/momo/edit/:id" element={<MomoForm />} />
                <Route path="/admin/momo/detail/:id" element={<MomoDetail />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default App;
