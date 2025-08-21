import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
const allRouters = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
]
export default allRouters;