import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import AdminPage from '@pages/AdminPage';
import UserPage from '@pages/UserPage';
import ProtectedRoute from '@components/ProtectedRoute';

const allRouters = [
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute requiredRole='admin'>
                <AdminPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/user',
        element: (
            <ProtectedRoute requiredRole='user'>
                <UserPage />
            </ProtectedRoute>
        )
    }
];
export default allRouters;
