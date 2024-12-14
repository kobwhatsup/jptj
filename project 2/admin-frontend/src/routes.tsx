import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './components/auth/LoginPage';
import UserManagement from './components/admin/UserManagement';
import ContentManagement from './components/admin/ContentManagement';
import Dashboard from './components/admin/Dashboard';
import ForumManagement from './components/admin/ForumManagement';
import { ErrorBoundary } from './components/common/error-boundary';
import { ProtectedRoute } from './components/common/protected-route';

export const routes = (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <ErrorBoundary>
            <DashboardLayout />
          </ErrorBoundary>
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="policies" element={<ContentManagement />} />
      <Route path="news" element={<ContentManagement />} />
      <Route path="forum" element={<ForumManagement />} />
    </Route>
  </Routes>
);

export default routes;
