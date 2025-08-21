import HomePage from '@pages/HomePage';
const allRouters = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,c
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  // Thêm các route khác ở đây
];

export default allRouters;