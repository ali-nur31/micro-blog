import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
    const { token, role, loading } = useAuth();

    if (loading) return <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}><span className="loader"></span></div>;

    if (!token || role !== 'ADMIN') {
        return <Navigate to="/feed" />;
    }

    return children ? children : <Outlet />;
}

export default AdminRoute;
