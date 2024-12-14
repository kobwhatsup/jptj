import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './components/auth/LoginPage';
import UserManagement from './components/admin/UserManagement';
import ContentManagement from './components/admin/ContentManagement';
import Dashboard from './components/admin/Dashboard';
import ForumManagement from './components/admin/ForumManagement';
import { ErrorBoundary } from './components/common/error-boundary';

export const routes = (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/dashboard"
      element={
        <ErrorBoundary>
          <DashboardLayout />
        </ErrorBoundary>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="policies" element={<ContentManagement />} />
      <Route path="news" element={<ContentManagement />} />
      <Route path="forum" element={<ForumManagement />} />
    </Route>
  </Routes>
);

export default routes;
