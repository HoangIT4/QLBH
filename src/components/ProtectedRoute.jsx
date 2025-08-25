import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        return <Navigate to='/login' replace />;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
        return <Navigate to='/login' replace />;
    }

    return children;
}

