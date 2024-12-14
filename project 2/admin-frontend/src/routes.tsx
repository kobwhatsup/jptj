import { createHashRouter } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './components/auth/LoginPage';
import UserManagement from './components/admin/UserManagement';
import ContentManagement from './components/admin/ContentManagement';

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'policies',
        element: <ContentManagement />,
      },
      {
        path: 'news',
        element: <ContentManagement />,
      },
    ],
  },
]);
