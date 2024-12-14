import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './components/auth/LoginPage';
import UserManagement from './components/admin/UserManagement';
import ContentManagement from './components/admin/ContentManagement';
import { ErrorBoundary } from './components/common/error-boundary';
import { ProtectedRoute } from './components/common/protected-route';

export const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorBoundary><Outlet /></ErrorBoundary>,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary><Outlet /></ErrorBoundary>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    errorElement: <ErrorBoundary><Outlet /></ErrorBoundary>,
    children: [
      {
        path: '',
        element: <Navigate to="users" replace />,
      },
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

export default router;
