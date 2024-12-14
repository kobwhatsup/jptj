import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './components/auth/LoginPage';
import UserManagement from './components/admin/UserManagement';
import ContentManagement from './components/admin/ContentManagement';
import Dashboard from './components/admin/Dashboard';
import { ErrorBoundary } from './components/common/error-boundary';
import { ProtectedRoute } from './components/common/protected-route';
import { AuthProvider } from './lib/contexts/AuthContext';

export const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorBoundary><Outlet /></ErrorBoundary>,
  },
  {
    path: '/login',
    element: <AuthProvider><LoginPage /></AuthProvider>,
    errorElement: <ErrorBoundary><Outlet /></ErrorBoundary>,
  },
  {
    path: '/dashboard',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    errorElement: <ErrorBoundary><Outlet /></ErrorBoundary>,
    children: [
      {
        path: '',
        element: <Dashboard />,
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
